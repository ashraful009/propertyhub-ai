const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  findBookingById,
  findBookingByIdWithRelations,
  findInstallmentById,
  findInstallmentsByBookingId,
  insertInstallments,
  countPendingInstallments,
  saveBooking,
  saveInstallment,
  findUnitById,
  saveUnit,
} = require('./installment.repository');
const generateInstallmentInvoicePDF = require('../../../utils/generateInstallmentInvoicePDF');
const { sendInstallmentPaymentEmail } = require('../../../utils/sendEmail');
const { ValidationError, NotFoundError, ForbiddenError } = require('../../../errors');

const MAX_INSTALLMENTS = 24;
const LATE_FEE_BDT = 5000;

const tierExtraPercentage = (n) => {
  if (n <= 4) return 0;
  if (n <= 12) return 7;
  return 12;
};

const dueDateForMonthOffset = (baseDate, offset) => {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 15, 23, 59, 59, 999);
  return d;
};

const isOverdue = (dueDate, now = new Date()) => now.getTime() > new Date(dueDate).getTime();

const setupInstallmentPlanService = async (bookingId, totalInstallments, userId) => {
  if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ValidationError('A valid bookingId is required.');
  }
  const n = Number(totalInstallments);
  if (!Number.isInteger(n) || n < 1) {
    throw new ValidationError('totalInstallments must be a positive integer.');
  }
  if (n > MAX_INSTALLMENTS) {
    throw new ValidationError(`Maximum installment limit is ${MAX_INSTALLMENTS}.`);
  }

  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found.');
  }
  if (booking.status === 'cancelled') {
    throw new ValidationError('This booking has been cancelled. Installment plans cannot be created.');
  }
  if (String(booking.customerId) !== String(userId)) {
    throw new ForbiddenError('Not authorized for this booking.');
  }
  if (booking.paymentStatus !== 'booking_paid') {
    throw new ValidationError('Installments can only be set up after the booking money is paid and before full payment.');
  }
  if (booking.installmentPlan?.active) {
    throw new ValidationError('An installment plan is already active for this booking.');
  }

  const dueAmount = (booking.totalPrice || 0) - (booking.bookingAmount || 0);
  if (dueAmount <= 0) {
    throw new ValidationError('There is no remaining due amount to split into installments.');
  }

  const extraPct = tierExtraPercentage(n);
  const baseEach = Math.floor(dueAmount / n);
  const today = new Date();
  const seeds = Array.from({ length: n }, (_, i) => {
    const isLast = i === n - 1;
    const baseAmount = isLast ? dueAmount - baseEach * (n - 1) : baseEach;
    const extraCharge = Math.round(baseAmount * extraPct / 100);
    return {
      bookingId: booking._id,
      customerId: booking.customerId,
      propertyId: booking.propertyId,
      companyId: booking.companyId,
      totalInstallments: n,
      extraChargePercentage: extraPct,
      installmentNumber: i + 1,
      dueDate: dueDateForMonthOffset(today, i),
      baseAmount,
      extraCharge,
      amountDue: baseAmount + extraCharge,
    };
  });

  const session = await mongoose.startSession();
  let installments;
  try {
    await session.withTransaction(async () => {
      installments = await insertInstallments(seeds, session);
      booking.installmentPlan = {
        active: true,
        totalCount: n,
        extraChargePercentage: extraPct,
        baseAmountPerInstallment: baseEach,
        totalDueAmount: dueAmount,
        createdAt: new Date(),
      };
      await saveBooking(booking, session);
    });
  } catch (err) {
    if (err?.errorLabels?.includes('TransientTransactionError') ||
        err?.code === 20 || /Transaction numbers are only allowed/i.test(err?.message || '')) {
      installments = await insertInstallments(seeds);
      booking.installmentPlan = {
        active: true,
        totalCount: n,
        extraChargePercentage: extraPct,
        baseAmountPerInstallment: baseEach,
        totalDueAmount: dueAmount,
        createdAt: new Date(),
      };
      await saveBooking(booking);
    } else {
      session.endSession();
      throw err;
    }
  } finally {
    session.endSession();
  }

  return { plan: booking.installmentPlan, installments, n };
};

const getBookingInstallmentsService = async (bookingId, userId, userRoles) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ValidationError('Invalid bookingId.');
  }

  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found.');
  }

  const isOwner = String(booking.customerId) === String(userId);
  const isAdmin = userRoles?.includes('Super Admin');
  if (!isOwner && !isAdmin) {
    throw new ForbiddenError('Not authorized.');
  }

  const installments = await findInstallmentsByBookingId(bookingId);
  const decorated = installments.map((i) => {
    const overdue = i.status === 'pending' && isOverdue(i.dueDate);
    return {
      ...i.toObject(),
      isOverdue: overdue,
      lateFeeIfPaidNow: overdue ? LATE_FEE_BDT : 0,
      payableNow: i.status === 'paid' ? 0 : i.amountDue + (overdue ? LATE_FEE_BDT : 0),
    };
  });

  return { plan: booking.installmentPlan, installments: decorated, bookingStatus: booking.status };
};

const createInstallmentPaymentSessionService = async (installmentId, userId, userEmail) => {
  if (!mongoose.Types.ObjectId.isValid(installmentId)) {
    throw new ValidationError('Invalid installment id.');
  }

  const installment = await findInstallmentById(installmentId);
  if (!installment) {
    throw new NotFoundError('Installment not found.');
  }
  if (String(installment.customerId) !== String(userId)) {
    throw new ForbiddenError('Not authorized for this installment.');
  }
  if (installment.status === 'paid') {
    throw new ValidationError('This installment is already paid.');
  }

  const booking = await findBookingById(installment.bookingId).populate('propertyId', 'title');
  if (!booking) {
    throw new NotFoundError('Parent booking not found.');
  }
  if (booking.status === 'cancelled') {
    throw new ValidationError('This booking has been cancelled. Payments are no longer accepted.');
  }

  const overdue = isOverdue(installment.dueDate);
  const lateFee = overdue ? LATE_FEE_BDT : 0;
  const chargeAmount = installment.amountDue + lateFee;

  let stripeCurrency = 'bdt';
  let stripeUnitAmount = chargeAmount * 100;
  if (chargeAmount > 999999) {
    stripeCurrency = 'usd';
    stripeUnitAmount = Math.round(chargeAmount / 120) * 100;
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const successUrl = `${clientUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}&type=installment`;
  const cancelUrl = `${clientUrl}/customer-dashboard?canceled=true`;
  const propTitle = booking.propertyId?.title || 'Property';
  const lateNote = overdue ? ` (incl. ৳${LATE_FEE_BDT.toLocaleString()} late fee)` : '';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: userEmail,
    line_items: [{
      price_data: {
        currency: stripeCurrency,
        product_data: {
          name: `Installment ${installment.installmentNumber}/${installment.totalInstallments} — ${propTitle}`,
          description: `Due ${new Date(installment.dueDate).toLocaleDateString('en-BD')}${lateNote}`,
        },
        unit_amount: stripeUnitAmount,
      },
      quantity: 1,
    }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      type: 'installment',
      installmentId: installment._id.toString(),
      bookingId: installment.bookingId.toString(),
      userId: userId.toString(),
      exactBdtAmount: chargeAmount.toString(),
      lateFeeApplied: lateFee.toString(),
    },
  });

  installment.stripeSessionId = session.id;
  await saveInstallment(installment);

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    meta: { amountDue: installment.amountDue, lateFee, chargeAmount, overdue },
  };
};

const confirmInstallmentPaymentService = async (sessionId) => {
  if (!sessionId) {
    throw new ValidationError('sessionId is required.');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (e) {
    throw new ValidationError('Invalid Stripe session.');
  }

  if (session.payment_status !== 'paid') {
    throw new ValidationError('Payment not successful.');
  }
  if (session.metadata?.type !== 'installment' || !session.metadata?.installmentId) {
    throw new ValidationError('Session is not for an installment payment.');
  }

  const installment = await findInstallmentById(session.metadata.installmentId);
  if (!installment) {
    throw new NotFoundError('Installment not found.');
  }

  if (installment.status === 'paid') {
    return { installment, alreadyConfirmed: true };
  }

  let paidBdt = session.amount_total / 100;
  if (session.metadata?.exactBdtAmount) {
    paidBdt = Number(session.metadata.exactBdtAmount);
  } else if (session.currency?.toLowerCase() === 'usd') {
    paidBdt = paidBdt * 120;
  }
  const lateFeeApplied = Number(session.metadata?.lateFeeApplied || 0);

  installment.status = 'paid';
  installment.paidAt = new Date();
  installment.paidAmount = paidBdt;
  installment.lateFee = lateFeeApplied;
  await saveInstallment(installment);

  const booking = await findBookingById(installment.bookingId);
  if (booking) {
    booking.bookingAmount = (booking.bookingAmount || 0) + installment.baseAmount;
    booking.lastPaymentDate = new Date();

    const remaining = await countPendingInstallments(booking._id);
    if (remaining === 0 || booking.bookingAmount >= booking.totalPrice) {
      booking.paymentStatus = 'fully_paid';
      const unit = await findUnitById(booking.unitId);
      if (unit) {
        unit.status = 'sold';
        await saveUnit(unit);
      }
    }
    await saveBooking(booking);
  }

  try {
    const fullBooking = await findBookingByIdWithRelations(installment.bookingId);
    if (fullBooking) {
      const pdfBuffer = await generateInstallmentInvoicePDF({
        booking: fullBooking,
        installment,
        property: fullBooking.propertyId,
        company: fullBooking.companyId,
        customer: fullBooking.customerId,
      });

      sendInstallmentPaymentEmail({
        customer: fullBooking.customerId,
        property: fullBooking.propertyId,
        company: fullBooking.companyId,
        booking: fullBooking,
        installment,
        pdfBuffer,
      }).catch((e) => console.error(' Installment email error:', e.message));
    }
  } catch (e) {
    console.error(' Installment PDF/Email error (non-fatal):', e.message);
  }

  return { installment, alreadyConfirmed: false };
};

const downloadInstallmentInvoiceService = async (installmentId, userId, userRoles) => {
  if (!mongoose.Types.ObjectId.isValid(installmentId)) {
    throw new ValidationError('Invalid installment id.');
  }

  const installment = await findInstallmentById(installmentId);
  if (!installment) {
    throw new NotFoundError('Installment not found.');
  }
  if (installment.status !== 'paid') {
    throw new ValidationError('Invoice is only available after the installment is paid.');
  }

  const isOwner = String(installment.customerId) === String(userId);
  const isAdmin = userRoles?.includes('Super Admin');
  if (!isOwner && !isAdmin) {
    throw new ForbiddenError('Not authorized.');
  }

  const booking = await findBookingByIdWithRelations(installment.bookingId);
  if (!booking) {
    throw new NotFoundError('Parent booking not found.');
  }

  const pdfBuffer = await generateInstallmentInvoicePDF({
    booking,
    installment,
    property: booking.propertyId,
    company: booking.companyId,
    customer: booking.customerId,
  });

  const filename = `FlatSell-Installment-${installment.installmentNumber}-${installment._id.toString().slice(-8).toUpperCase()}.pdf`;
  return { pdfBuffer, filename };
};

module.exports = {
  setupInstallmentPlanService,
  getBookingInstallmentsService,
  createInstallmentPaymentSessionService,
  confirmInstallmentPaymentService,
  downloadInstallmentInvoiceService,
};
