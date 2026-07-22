const {
  findUnitById,
  saveUnit,
  createBooking,
  findBookingById,
  findBookingByIdWithRelations,
  saveBooking,
  findCustomerBookings,
  findCompanyByOwnerId,
  findCompanyBookings,
  findBookingByUnitAndCustomer,
  upsertCommission,
  findBookingsWithQuery,
  findAutoCancelledBookings,
} = require('./booking.repository');
const generateInvoicePDF = require('../../../utils/generateInvoicePDF');
const generateReportPDF = require('../../../utils/generateReportPDF');
const { sendPaymentConfirmationEmail } = require('../../../utils/sendEmail');
const { canCreateBooking, getLimitStatus } = require('./bookingLimits.service');
const { logAudit } = require('../audit/audit.service');
const { NotFoundError, ValidationError, ForbiddenError, ConflictError } = require('../../../errors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createBookingService = async (unitId, message, userId) => {
  if (!unitId) {
    throw new ValidationError('unitId is required');
  }

  const unit = await findUnitById(unitId);
  if (!unit) {
    throw new NotFoundError('Unit not found');
  }

  if (unit.status !== 'available') {
    throw new ValidationError(`Unit is already ${unit.status}`);
  }

  const companyId = unit.propertyId.companyId;
  const limitCheck = await canCreateBooking(userId, companyId);
  if (!limitCheck.allowed) {
    await logAudit({
      action: 'booking_limit_blocked',
      userId,
      performedBy: userId,
      notes: limitCheck.reason,
      meta: { code: limitCheck.code, companyId: String(companyId) },
    });
    const err = new ConflictError(limitCheck.reason);
    err.details = { code: limitCheck.code };
    throw err;
  }

  const booking = await createBooking({
    propertyId: unit.propertyId._id,
    unitId: unit._id,
    customerId: userId,
    companyId: unit.propertyId.companyId,
    message: message || '',
  });

  unit.status = 'booked';
  unit.bookedBy = userId;
  await saveUnit(unit);

  return booking;
};

const getMyBookingsService = async (userId) => {
  return findCustomerBookings(userId);
};

const getCompanyBookingsService = async (ownerId) => {
  const company = await findCompanyByOwnerId(ownerId);
  if (!company) {
    throw new ForbiddenError('Company not found');
  }
  return findCompanyBookings(company._id);
};

const updateBookingStatusService = async (bookingId, status) => {
  if (!['confirmed', 'rejected', 'cancelled'].includes(status)) {
    throw new ValidationError('Invalid booking status');
  }

  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  booking.status = status;
  await saveBooking(booking);

  if (status === 'rejected' || status === 'cancelled') {
    const unit = await findUnitById(booking.unitId);
    if (unit) {
      unit.status = 'available';
      unit.bookedBy = null;
      await saveUnit(unit);
    }
  }

  return booking;
};

const confirmStripeBookingService = async (sessionId) => {
  if (!sessionId) {
    throw new ValidationError('sessionId is required');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== 'paid') {
    throw new ValidationError('Payment not successful');
  }

  const { bookingId, unitId, userId, type } = session.metadata;

  if (type === 'due') {
    const booking = await findBookingById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.paymentStatus === 'fully_paid') {
      return { booking, message: 'Payment already confirmed' };
    }

    let paidAmount = session.amount_total / 100;
    if (session.metadata?.exactBdtAmount) {
      paidAmount = Number(session.metadata.exactBdtAmount);
    } else if (session.currency && session.currency.toLowerCase() === 'usd') {
      paidAmount = paidAmount * 120;
    }

    booking.bookingAmount = (booking.bookingAmount || 0) + paidAmount;
    booking.lastPaymentDate = new Date();

    if (booking.bookingAmount >= booking.totalPrice) {
      booking.paymentStatus = 'fully_paid';
      const unit = await findUnitById(booking.unitId);
      if (unit) {
        unit.status = 'sold';
        await saveUnit(unit);
      }
    }

    await saveBooking(booking);
    return {
      booking,
      message: booking.paymentStatus === 'fully_paid'
        ? 'Full payment confirmed! Property is now yours.'
        : `Partial payment of ৳${paidAmount.toLocaleString()} confirmed.`,
    };
  }

  let booking = bookingId
    ? await findBookingById(bookingId)
    : await findBookingByUnitAndCustomer(unitId, userId);

  if (!booking) {
    const unit = await findUnitById(unitId);
    if (!unit) {
      throw new NotFoundError('Unit not found');
    }

    let fallbackPaidAmount = session.amount_total / 100;
    if (session.metadata?.exactBdtAmount) {
      fallbackPaidAmount = Number(session.metadata.exactBdtAmount);
    } else if (session.currency && session.currency.toLowerCase() === 'usd') {
      fallbackPaidAmount = fallbackPaidAmount * 120;
    }

    booking = await createBooking({
      propertyId: unit.propertyId._id,
      unitId: unit._id,
      customerId: userId,
      companyId: unit.propertyId.companyId,
      status: 'confirmed',
      paymentStatus: 'booking_paid',
      bookingAmount: fallbackPaidAmount,
      lastPaymentDate: new Date(),
    });

    unit.status = 'booked';
    unit.bookedBy = userId;
    await saveUnit(unit);
  } else {
    booking.status = 'confirmed';
    booking.paymentStatus = 'booking_paid';
    booking.bookingStripeSessionId = sessionId;
    booking.lastPaymentDate = new Date();
    await saveBooking(booking);
  }

  await booking.populate('propertyId', 'category');

  if (booking.propertyId && booking.totalPrice) {
    const category = booking.propertyId.category;
    let commissionPercentage = 0;

    if (category === 'apartment') commissionPercentage = 3;
    else if (category === 'land') commissionPercentage = 5;
    else if (category === 'villa') commissionPercentage = 7;

    if (commissionPercentage > 0) {
      const commissionAmount = Math.round(booking.totalPrice * (commissionPercentage / 100));
      await upsertCommission(booking._id, {
        propertyId: booking.propertyId._id,
        companyId: booking.companyId,
        category: category,
        totalPrice: booking.totalPrice,
        commissionPercentage,
        commissionAmount,
      });
    }
  }

  try {
    const fullBooking = await findBookingByIdWithRelations(booking._id);
    if (fullBooking) {
      const pdfBuffer = await generateInvoicePDF({
        booking: fullBooking,
        property: fullBooking.propertyId,
        company: fullBooking.companyId,
        customer: fullBooking.customerId,
      });

      sendPaymentConfirmationEmail({
        customer: fullBooking.customerId,
        property: fullBooking.propertyId,
        company: fullBooking.companyId,
        booking: fullBooking,
        pdfBuffer,
      }).catch((e) => console.error('❌ Invoice email error:', e.message));
    }
  } catch (emailErr) {
    console.error('❌ PDF/Email generation error (non-fatal):', emailErr.message);
  }

  return { booking, message: 'Booking confirmed successfully' };
};

const getBookingInvoiceService = async (bookingId, userId, userRoles) => {
  const booking = await findBookingByIdWithRelations(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  const isOwner = String(booking.customerId?._id) === String(userId);
  const isAdmin = userRoles?.includes('Super Admin');
  if (!isOwner && !isAdmin) {
    throw new ForbiddenError('Not authorized to download this invoice');
  }

  const pdfBuffer = await generateInvoicePDF({
    booking,
    property: booking.propertyId,
    company: booking.companyId,
    customer: booking.customerId,
  });

  const filename = `FlatSell-Invoice-${booking._id.toString().slice(-8).toUpperCase()}.pdf`;
  return { pdfBuffer, filename };
};

const getSalesReportService = async (startDate, endDate, userId, userRoles) => {
  const isAdmin = userRoles?.includes('Super Admin');

  const query = {
    status: 'confirmed',
    paymentStatus: { $in: ['booking_paid', 'fully_paid'] },
  };

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  }

  if (!isAdmin) {
    const company = await findCompanyByOwnerId(userId);
    if (!company) {
      throw new ForbiddenError('Company not found');
    }
    query.companyId = company._id;
  }

  const bookings = await findBookingsWithQuery(query, isAdmin);
  return { bookings, count: bookings.length };
};

const getSalesReportPDFService = async (startDate, endDate, userId, userRoles) => {
  const isAdmin = userRoles?.includes('Super Admin');

  const query = {
    status: 'confirmed',
    paymentStatus: { $in: ['booking_paid', 'fully_paid'] },
  };

  let subtitle = 'Platform-Wide';
  let dateRange = 'All Time';

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
    const fmtDate = (d) => new Date(d).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' });
    dateRange = `${fmtDate(startDate)} – ${fmtDate(endDate)}`;
  }

  if (!isAdmin) {
    const company = await findCompanyByOwnerId(userId);
    if (!company) {
      throw new ForbiddenError('Company not found');
    }
    query.companyId = company._id;
    subtitle = company.name;
  }

  const bookings = await findBookingsWithQuery(query, false);

  const fmt = (n) => `৳${Number(n || 0).toLocaleString()}`;
  const rows = bookings.map((b, i) => [
    i + 1,
    b.propertyId?.title || '—',
    b.companyId?.name || '—',
    b.customerId?.name || '—',
    (b.propertyId?.category || '').toUpperCase(),
    b.paymentStatus === 'fully_paid' ? 'Fully Paid' : 'Booking Paid',
    fmt(b.totalPrice),
    fmt(b.bookingAmount),
    new Date(b.createdAt).toLocaleDateString('en-BD'),
  ]);

  const totalRevenue = bookings.reduce((s, b) => s + (b.paymentStatus === 'fully_paid' ? b.totalPrice : b.bookingAmount || 0), 0);

  const pdfBuffer = await generateReportPDF({
    title: 'Booked Properties — Sales Report',
    subtitle,
    dateRange,
    columns: ['#', 'Property', 'Company', 'Customer', 'Category', 'Status', 'Total Price', 'Paid', 'Date'],
    colWidths: [22, 90, 72, 68, 56, 56, 60, 52, 55],
    rows,
    summaryRows: [
      { label: 'Total Bookings', value: bookings.length },
      { label: 'Total Revenue Collected', value: fmt(totalRevenue) },
    ],
  });

  const filename = `FlatSell-Sales-Report-${Date.now()}.pdf`;
  return { pdfBuffer, filename };
};

const checkMyBookingLimitService = async (userId, companyId) => {
  const status = await getLimitStatus(userId, companyId || null);

  let blocked = null;
  if (status.totalActive >= status.totalLimit) {
    blocked = {
      code: 'TOTAL_LIMIT',
      reason: `You have reached the maximum of ${status.totalLimit} active bookings. Please contact the Super Admin to book more.`,
    };
  } else if (companyId && status.vendorActive >= status.perVendorLimit) {
    blocked = {
      code: 'VENDOR_LIMIT',
      reason: `You already have ${status.perVendorLimit} active bookings with this vendor. Please complete full payment on one to proceed.`,
    };
  }

  return { ...status, allowed: !blocked, blocked };
};

const getAutoCancelledBookingsService = async (reason) => {
  const query = { status: 'cancelled' };
  if (reason && ['inactivity', 'manual', 'refund_requested'].includes(reason)) {
    query.cancellationReason = reason;
  } else {
    query.cancellationReason = 'inactivity';
  }
  const bookings = await findAutoCancelledBookings(query);
  return { bookings, count: bookings.length };
};

module.exports = {
  createBookingService,
  getMyBookingsService,
  getCompanyBookingsService,
  updateBookingStatusService,
  confirmStripeBookingService,
  getBookingInvoiceService,
  getSalesReportService,
  getSalesReportPDFService,
  checkMyBookingLimitService,
  getAutoCancelledBookingsService,
};
