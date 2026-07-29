const {
  findBookingById,
  findCommissionByBookingId,
  findCompanyById,
  findCompanyByOwnerId,
  saveCompany,
  createRefundRequest,
  createVendorLedger,
  saveBooking,
  findUnitById,
  saveUnit,
  updateBookingStatus,
  findRefundRequests,
  findVendorRefundRequests,
  findRefundRequestById,
  saveRefundRequest,
} = require('./refund.repository');
const PlatformSettings = require('../../admin/settings/platformSettings.model');
const { logAudit } = require('../../shared/audit/audit.service');
const { isWithinRefundWindow, daysBetween } = require('../../../utils/dateUtils');
const { sendRefundApprovedEmail, sendVendorRefundDeductionEmail } = require('../../../utils/sendEmail');
const { NotFoundError, ValidationError, UnauthorizedError, ForbiddenError } = require('../../../errors');

const requestRefundService = async (bookingId, userId) => {
  const settings = await PlatformSettings.getSettings();
  const windowDays = settings.refundWindowDays;
  const retentionPct = settings.refundRetentionPercentage;

  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found.');
  }

  if (String(booking.customerId?._id) !== String(userId)) {
    throw new ForbiddenError('Not authorized for this booking.');
  }

  if (booking.refundStatus && booking.refundStatus !== 'none') {
    throw new ValidationError('A refund has already been requested for this booking.');
  }

  if (booking.status === 'cancelled') {
    throw new ValidationError('This booking is already cancelled and is not eligible for a refund.');
  }

  if (!isWithinRefundWindow(booking.createdAt, windowDays)) {
    const elapsed = daysBetween(booking.createdAt);
    throw new ValidationError(`Refund period has expired. Refunds are only accepted within ${windowDays} days of booking (it has been ${elapsed} days). No refund can be issued.`);
  }

  const amountPaid = booking.bookingAmount || 0;
  if (amountPaid <= 0) {
    throw new ValidationError('No payment has been made on this booking, so there is nothing to refund.');
  }

  const retentionAmount = Math.round(amountPaid * (retentionPct / 100));
  const refundAmount = amountPaid - retentionAmount;

  const refund = await createRefundRequest({
    bookingId: booking._id,
    customerId: booking.customerId._id,
    companyId: booking.companyId._id,
    amountPaid,
    refundAmount,
    retentionAmount,
    retentionPercentage: retentionPct,
    status: 'approved',
    processedAt: new Date(),
    processedBy: null,
    notes: 'Auto-approved on request per Policy 2.',
  });

  const commission = await findCommissionByBookingId(booking._id);
  const commissionAmount = commission ? commission.commissionAmount : 0;
  const totalVendorDeduction = refundAmount + commissionAmount;

  const company = await findCompanyById(booking.companyId._id);
  let newBalance = 0;
  if (company) {
    company.walletBalance = (company.walletBalance || 0) - totalVendorDeduction;
    newBalance = company.walletBalance;
    await saveCompany(company);

    await createVendorLedger({
      companyId: company._id,
      type: 'refund_debit',
      amount: -totalVendorDeduction,
      balanceAfter: newBalance,
      bookingId: booking._id,
      refundRequestId: refund._id,
      notes: `Refund to customer: ৳${refundAmount.toLocaleString()} + Platform Commission Paid: ৳${commissionAmount.toLocaleString()}`,
    });
  }

  booking.refundStatus = 'approved';
  booking.refundRequestedAt = refund.requestedAt;
  booking.refundAmount = refundAmount;
  booking.retentionAmount = retentionAmount;
  booking.status = 'cancelled';
  booking.cancellationReason = 'refund_requested';
  booking.cancelledAt = new Date();
  booking.noRefund = false;
  await saveBooking(booking);

  const unit = await findUnitById(booking.unitId);
  if (unit && unit.status !== 'sold') {
    unit.status = 'available';
    unit.bookedBy = null;
    await saveUnit(unit);
  }

  await logAudit({
    action: 'refund_requested',
    userId: booking.customerId._id,
    bookingId: booking._id,
    performedBy: userId,
    notes: `Refund requested & approved: paid ${amountPaid}, retained ${retentionAmount} (${retentionPct}%), refunded ${refundAmount} from vendor wallet.`,
    meta: { amountPaid, refundAmount, retentionAmount, retentionPct, vendorBalanceAfter: newBalance },
  });

  sendRefundApprovedEmail({
    customer: booking.customerId,
    property: booking.propertyId,
    refundAmount,
    retentionAmount,
    amountPaid,
  }).catch((e) => console.error(' Refund (customer) email failed:', e.message));

  if (booking.companyId?.email) {
    sendVendorRefundDeductionEmail({
      vendorEmail: booking.companyId.email,
      companyName: booking.companyId.name,
      property: booking.propertyId,
      customerName: booking.customerId.name,
      refundAmount,
      walletBalance: newBalance,
    }).catch((e) => console.error(' Refund (vendor) email failed:', e.message));
  }

  return { refundAmount, retentionAmount, retentionPct, refund, booking };
};

const getAllRefundsService = async (status) => {
  const query = {};
  if (status && ['pending', 'approved', 'rejected', 'completed'].includes(status)) {
    query.status = status;
  }
  const refunds = await findRefundRequests(query);
  return { refunds, count: refunds.length };
};

const getVendorRefundsService = async (userId) => {
  const company = await findCompanyByOwnerId(userId);
  if (!company) {
    throw new ForbiddenError('Company not found for this user.');
  }

  const refunds = await findVendorRefundRequests(company._id);
  return { refunds, walletBalance: company.walletBalance || 0, count: refunds.length };
};

const completeRefundService = async (refundId, userId) => {
  const refund = await findRefundRequestById(refundId);
  if (!refund) {
    throw new NotFoundError('Refund request not found.');
  }
  if (refund.status === 'completed') {
    throw new ValidationError('Refund is already completed.');
  }

  refund.status = 'completed';
  refund.processedAt = new Date();
  refund.processedBy = userId;
  await saveRefundRequest(refund);

  await updateBookingStatus(refund.bookingId, { refundStatus: 'completed' });

  await logAudit({
    action: 'refund_completed',
    userId: refund.customerId,
    bookingId: refund.bookingId,
    performedBy: userId,
    notes: `Refund of ${refund.refundAmount} marked completed (disbursed).`,
  });

  return refund;
};

module.exports = {
  requestRefundService,
  getAllRefundsService,
  getVendorRefundsService,
  completeRefundService,
};
