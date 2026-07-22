require('dotenv').config();
const mongoose = require('mongoose');

const connectDB        = require('./db');
const PlatformSettings = require('../features/admin/settings/platformSettings.model');
const Booking          = require('../features/shared/bookings/booking.model');
const Company          = require('../features/shared/companies/company.model');

const run = async () => {
  await connectDB();

  const settings = await PlatformSettings.getSettings();
  console.log('✅ PlatformSettings ready:', {
    inactivityCancelMonths:     settings.inactivityCancelMonths,
    inactivityWarnMonths:       settings.inactivityWarnMonths,
    refundWindowDays:           settings.refundWindowDays,
    refundRetentionPercentage:  settings.refundRetentionPercentage,
    maxActiveBookingsPerVendor: settings.maxActiveBookingsPerVendor,
    maxTotalActiveBookings:     settings.maxTotalActiveBookings,
  });

  const paidWithoutDate = await Booking.find({
    paymentStatus: { $in: ['booking_paid', 'fully_paid'] },
    $or: [{ lastPaymentDate: null }, { lastPaymentDate: { $exists: false } }],
  }).select('updatedAt createdAt');

  let backfilled = 0;
  for (const b of paidWithoutDate) {
    b.lastPaymentDate = b.updatedAt || b.createdAt;
    await b.save();
    backfilled += 1;
  }
  console.log(`✅ Backfilled lastPaymentDate on ${backfilled} paid booking(s).`);

  const walletResult = await Company.updateMany(
    { $or: [{ walletBalance: null }, { walletBalance: { $exists: false } }] },
    { $set: { walletBalance: 0 } }
  );
  console.log(`✅ Initialised walletBalance on ${walletResult.modifiedCount} company/companies.`);

  await Promise.all([
    Booking.syncIndexes(),
    Company.syncIndexes(),
    PlatformSettings.syncIndexes(),
  ]);
  console.log('✅ Indexes synced (Booking, Company, PlatformSettings).');

  await mongoose.disconnect();
  console.log('🎉 Policy migration complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
