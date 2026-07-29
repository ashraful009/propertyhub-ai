const Booking               = require('./booking.model');
const BookingLimitOverride  = require('../overrides/bookingLimitOverride.model');
const PlatformSettings      = require('../../admin/settings/platformSettings.model');

const ACTIVE_STATUS_FILTER = {
  status:        { $in: ['pending', 'confirmed'] },
  paymentStatus: { $ne: 'fully_paid' },
};

const PAID_STATUSES = ['booking_paid', 'fully_paid'];

const getLimitStatus = async (userId, companyId = null) => {
  const settings        = await PlatformSettings.getSettings();
  const perVendorLimit  = settings.maxActiveBookingsPerVendor;
  const baseTotalLimit  = settings.maxTotalActiveBookings;

  const override   = await BookingLimitOverride.findOne({ userId });
  const totalLimit = override ? override.overrideLimit : baseTotalLimit;

  const activeForUser = await Booking.find({ customerId: userId, ...ACTIVE_STATUS_FILTER })
    .select('companyId paymentStatus');

  const totalActive = activeForUser.length;

  let vendorActive = 0;
  let vendorPaid   = 0;
  if (companyId) {
    const sameVendor = activeForUser.filter((b) => String(b.companyId) === String(companyId));
    vendorActive = sameVendor.length;
    vendorPaid   = sameVendor.filter((b) => PAID_STATUSES.includes(b.paymentStatus)).length;
  }

  return {
    totalActive,
    totalLimit,
    hasOverride:     !!override,
    overrideLimit:   override ? override.overrideLimit : null,
    perVendorLimit,
    vendorActive,
    vendorPaid,
    remaining:       Math.max(0, totalLimit - totalActive),
  };
};

const canCreateBooking = async (userId, companyId) => {
  const status = await getLimitStatus(userId, companyId);

  if (status.totalActive >= status.totalLimit) {
    return {
      allowed: false,
      code:    'TOTAL_LIMIT',
      reason:  `You have reached the maximum of ${status.totalLimit} active bookings. Please contact the Super Admin to book more.`,
      status,
    };
  }

  if (
    companyId &&
    status.vendorActive >= status.perVendorLimit
  ) {
    return {
      allowed: false,
      code:    'VENDOR_LIMIT',
      reason:  `You already have ${status.perVendorLimit} active bookings with this vendor. Please complete full payment on one to proceed.`,
      status,
    };
  }

  return { allowed: true, status };
};

module.exports = {
  getLimitStatus,
  canCreateBooking,
  ACTIVE_STATUS_FILTER,
};
