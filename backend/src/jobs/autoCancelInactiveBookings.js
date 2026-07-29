const Booking          = require('../features/shared/bookings/booking.model');
const Unit             = require('../features/shared/units/unit.model');
const PlatformSettings = require('../features/admin/settings/platformSettings.model');
const { logAudit }     = require('../features/shared/audit/audit.service');
const { monthsBetween } = require('../utils/dateUtils');
const {
  sendInactivityWarningEmail,
  sendAutoCancellationEmail,
} = require('../utils/sendEmail');

const resolveInactivity = (booking) => {
  
  if (booking.paymentStatus === 'unpaid') {
    return { inScope: true, reference: booking.createdAt, rule: 'A' };
  }
  
  if (booking.installmentPlan?.active && booking.paymentStatus !== 'fully_paid') {
    const reference =
      booking.lastPaymentDate ||
      booking.installmentPlan.createdAt ||
      booking.createdAt;
    return { inScope: true, reference, rule: 'B' };
  }
  
  return { inScope: false, reference: null, rule: null };
};

const cancelForInactivity = async (booking, monthsInactive) => {
  booking.status             = 'cancelled';
  booking.cancellationReason = 'inactivity';
  booking.cancelledAt        = new Date();
  booking.noRefund           = true;
  booking.autoCancelCheckedAt = new Date();
  await booking.save();

  const unit = await Unit.findById(booking.unitId);
  if (unit && unit.status !== 'sold') {
    unit.status   = 'available';
    unit.bookedBy = null;
    await unit.save();
  }

  await logAudit({
    action:    'auto_cancel_inactivity',
    userId:    booking.customerId?._id || booking.customerId,
    bookingId: booking._id,
    performedBy: null, 
    notes:     `Auto-cancelled (no refund) after ${monthsInactive} months of payment inactivity.`,
    meta:      { monthsInactive },
  });

  if (booking.customerId?.email) {
    sendAutoCancellationEmail({
      customer: booking.customerId,
      property: booking.propertyId,
      monthsInactive,
    }).catch((e) => console.error(' Auto-cancel email failed:', e.message));
  }
};

const warnInactivity = async (booking, cancelMonths) => {
  booking.inactivityWarningSentAt = new Date();
  booking.autoCancelCheckedAt     = new Date();
  await booking.save();

  await logAudit({
    action:    'inactivity_warning_sent',
    userId:    booking.customerId?._id || booking.customerId,
    bookingId: booking._id,
    performedBy: null,
    notes:     'Sent 2-month inactivity warning (cancellation in ~30 days).',
  });

  if (booking.customerId?.email) {
    
    sendInactivityWarningEmail({
      customer: booking.customerId,
      property: booking.propertyId,
      daysUntilCancel: 30,
    }).catch((e) => console.error(' Inactivity warning email failed:', e.message));
  }
};

const runAutoCancelInactiveBookings = async () => {
  const settings     = await PlatformSettings.getSettings();
  const cancelMonths = settings.inactivityCancelMonths;
  const warnMonths   = settings.inactivityWarnMonths;

  const candidates = await Booking.find({
    status:        { $in: ['pending', 'confirmed'] },
    paymentStatus: { $ne: 'fully_paid' },
    cancellationReason: null,
  })
    .populate('customerId', 'name email')
    .populate('propertyId', 'title');

  let warned = 0;
  let cancelled = 0;
  let checked = 0;

  for (const booking of candidates) {
    try {
      const { inScope, reference } = resolveInactivity(booking);
      if (!inScope) continue;

      checked += 1;
      const monthsInactive = monthsBetween(reference, new Date());

      if (monthsInactive >= cancelMonths) {
        await cancelForInactivity(booking, monthsInactive);
        cancelled += 1;
      } else if (monthsInactive >= warnMonths && !booking.inactivityWarningSentAt) {
        await warnInactivity(booking, cancelMonths);
        warned += 1;
      } else {
        booking.autoCancelCheckedAt = new Date();
        await booking.save();
      }
    } catch (err) {
      console.error(` Auto-cancel check failed for booking ${booking._id}:`, err.message);
    }
  }

  const summary = { scanned: candidates.length, checked, warned, cancelled };
  console.log(` [Policy 1] Inactivity scan complete:`, summary);
  return summary;
};

module.exports = { runAutoCancelInactiveBookings, resolveInactivity };
