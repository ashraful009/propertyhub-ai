const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  findUnitById,
  saveUnit,
  findBookingByUnitAndCustomer,
  findBookingById,
  createBooking,
  saveBooking,
  findBookingPolicy,
} = require('./checkout.repository');
const { canCreateBooking } = require('../../shared/bookings/bookingLimits.service');
const { logAudit } = require('../../shared/audit/audit.service');
const { NotFoundError, ValidationError, ConflictError, ForbiddenError } = require('../../../errors');

const calculateTotalPrice = (property, unit) => {
  if (property.category === 'apartment' && property.flatTypes?.length > 0) {
    const match = unit.unitNumber?.match(/\d+([A-Z]+)/i);
    if (match) {
      const colIndex = match[1].charCodeAt(0) - 65;
      const typeIndex = Math.min(colIndex, property.flatTypes.length - 1);
      const flatType = property.flatTypes[typeIndex];
      if (flatType?.pricePerUnit) return flatType.pricePerUnit;
    }
  }
  return property.price || 0;
};

const createCheckoutSessionService = async (data, userId, userEmail) => {
  const { unitId, message, kycData, documents, refundPolicyAccepted } = data;

  if (!unitId) {
    throw new ValidationError('unitId is required');
  }

  if (!refundPolicyAccepted) {
    throw new ValidationError('You must acknowledge the refund policy before completing your booking.');
  }

  const unit = await findUnitById(unitId);
  if (!unit) {
    throw new NotFoundError('Unit not found');
  }

  if (unit.status !== 'available') {
    throw new ValidationError(`Unit is already ${unit.status}`);
  }

  const property = unit.propertyId;

  const limitCheck = await canCreateBooking(userId, property.companyId);
  if (!limitCheck.allowed) {
    await logAudit({
      action: 'booking_limit_blocked',
      userId,
      performedBy: userId,
      notes: limitCheck.reason,
      meta: { code: limitCheck.code, companyId: String(property.companyId) },
    });
    const error = new ConflictError(limitCheck.reason);
    error.details = { code: limitCheck.code };
    throw error;
  }

  const totalPrice = calculateTotalPrice(property, unit);
  if (totalPrice <= 0) {
    throw new ValidationError('Invalid total price (0)');
  }

  let bookingMoneyPercentage = 20;
  try {
    const policy = await findBookingPolicy(property.companyId, property.category);
    if (policy?.bookingMoneyPercentage) {
      bookingMoneyPercentage = policy.bookingMoneyPercentage;
    }
  } catch (e) {
    
  }

  let bookingAmount = Math.round(totalPrice * (bookingMoneyPercentage / 100));
  if (bookingAmount <= 0) {
    throw new ValidationError('Calculated booking amount is 0');
  }

  let stripeCurrency = 'bdt';
  let stripeUnitAmount = bookingAmount * 100;

  if (bookingAmount > 999999) {
    stripeCurrency = 'usd';
    const usdAmount = Math.round(bookingAmount / 120);
    stripeUnitAmount = usdAmount * 100;
  }

  let booking = await findBookingByUnitAndCustomer(unitId, userId);
  if (!booking) {
    booking = await createBooking({
      propertyId: property._id,
      unitId: unit._id,
      customerId: userId,
      companyId: property.companyId,
      message: message || '',
      totalPrice,
      bookingMoneyPercentage,
      bookingAmount,
      kycData: kycData || null,
      documents: documents || null,
      status: 'pending',
      paymentStatus: 'unpaid',
      refundPolicyAccepted: true,
    });

    unit.status = 'booked';
    unit.bookedBy = userId;
    await saveUnit(unit);
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const successUrl = `${clientUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}&type=booking`;
  const cancelUrl = `${clientUrl}/property/${property._id}?canceled=true`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: stripeCurrency,
          product_data: {
            name: `Booking Money for ${property.title}${unit.unitNumber ? ` - Unit ${unit.unitNumber}` : ''}`,
            description: `${bookingMoneyPercentage}% of total price ৳${totalPrice.toLocaleString()} | Category: ${property.category}`,
          },
          unit_amount: stripeUnitAmount,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      bookingId: booking._id.toString(),
      unitId: unit._id.toString(),
      userId: userId.toString(),
      type: 'booking',
      exactBdtAmount: bookingAmount.toString(),
    },
  });

  booking.bookingStripeSessionId = session.id;
  await saveBooking(booking);

  return { checkoutUrl: session.url, sessionId: session.id };
};

const createDuePaymentSessionService = async (bookingId, userId, userEmail) => {
  if (!bookingId) {
    throw new ValidationError('bookingId is required');
  }

  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.status === 'cancelled') {
    throw new ValidationError('This booking has been cancelled. Payments are no longer accepted.');
  }

  if (String(booking.customerId) !== String(userId)) {
    throw new ForbiddenError('Not authorized');
  }

  if (booking.paymentStatus !== 'booking_paid') {
    throw new ValidationError('Booking money has not been paid yet, or already fully paid.');
  }

  if (booking.installmentPlan?.active) {
    throw new ValidationError('An installment plan is active for this booking. Pay installments individually instead.');
  }

  let dueAmount = (booking.totalPrice || 0) - (booking.bookingAmount || 0);
  if (dueAmount <= 0) {
    throw new ValidationError('No due amount remaining');
  }

  let stripeCurrency = 'bdt';
  let stripeUnitAmount = dueAmount * 100;

  if (dueAmount > 999999) {
    stripeCurrency = 'usd';
    const usdAmount = Math.round(dueAmount / 120);
    stripeUnitAmount = usdAmount * 100;
  }

  const property = booking.propertyId;

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const successUrl = `${clientUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}&type=due`;
  const cancelUrl = `${clientUrl}/customer-dashboard/my-properties?canceled=true`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: stripeCurrency,
          product_data: {
            name: `Due Payment for ${property?.title || 'Property'}`,
            description: `Remaining balance: ৳${dueAmount.toLocaleString()}`,
          },
          unit_amount: stripeUnitAmount,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      bookingId: booking._id.toString(),
      userId: userId.toString(),
      type: 'due',
      exactBdtAmount: dueAmount.toString(),
    },
  });

  booking.duePaymentStripeSessionId = session.id;
  await saveBooking(booking);

  return { checkoutUrl: session.url, sessionId: session.id };
};

const processUploadedDocuments = (files) => {
  if (!files || files.length === 0) {
    throw new ValidationError('No files uploaded');
  }

  const documents = {};
  files.forEach((file) => {
    documents[file.fieldname] = {
      name: file.originalname,
      type: file.mimetype,
      url: file.path,
    };
  });

  return documents;
};

module.exports = {
  createCheckoutSessionService,
  createDuePaymentSessionService,
  processUploadedDocuments,
};
