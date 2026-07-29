const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema(
  {
    
    key: { type: String, default: 'global', unique: true, immutable: true },

    inactivityCancelMonths:  { type: Number, default: 3, min: 1, max: 24 }, 
    inactivityWarnMonths:    { type: Number, default: 2, min: 1, max: 24 }, 

    refundWindowDays:           { type: Number, default: 30, min: 1, max: 365 }, 
    refundRetentionPercentage:  { type: Number, default: 20, min: 0, max: 100 }, 

    maxActiveBookingsPerVendor: { type: Number, default: 2, min: 1, max: 50 },
    maxTotalActiveBookings:     { type: Number, default: 5, min: 1, max: 100 },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const PlatformSettings = mongoose.model('PlatformSettings', platformSettingsSchema);

PlatformSettings.getSettings = async function () {
  let settings = await this.findOne({ key: 'global' });
  if (!settings) {
    settings = await this.create({ key: 'global' });
  }
  return settings;
};

module.exports = PlatformSettings;
