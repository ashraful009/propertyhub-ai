const { getPlatformSettings, savePlatformSettings } = require('./platformSettings.repository');
const { logAudit } = require('../../shared/audit/audit.service');

const EDITABLE_FIELDS = [
  'inactivityCancelMonths',
  'inactivityWarnMonths',
  'refundWindowDays',
  'refundRetentionPercentage',
  'maxActiveBookingsPerVendor',
  'maxTotalActiveBookings',
];

const getSettingsService = async () => {
  return getPlatformSettings();
};

const getPublicSettingsService = async () => {
  const s = await getPlatformSettings();
  return {
    inactivityCancelMonths: s.inactivityCancelMonths,
    inactivityWarnMonths: s.inactivityWarnMonths,
    refundWindowDays: s.refundWindowDays,
    refundRetentionPercentage: s.refundRetentionPercentage,
    maxActiveBookingsPerVendor: s.maxActiveBookingsPerVendor,
    maxTotalActiveBookings: s.maxTotalActiveBookings,
  };
};

const updateSettingsService = async (data, userId) => {
  const settings = await getPlatformSettings();
  const changes = {};

  EDITABLE_FIELDS.forEach((field) => {
    if (data[field] !== undefined) {
      const num = Number(data[field]);
      if (!Number.isFinite(num) || num < 0) return;
      if (settings[field] !== num) changes[field] = { from: settings[field], to: num };
      settings[field] = num;
    }
  });

  settings.updatedBy = userId;
  await savePlatformSettings(settings);

  await logAudit({
    action: 'platform_settings_updated',
    performedBy: userId,
    notes: 'Super Admin updated platform policy settings',
    meta: changes,
  });

  return settings;
};

module.exports = {
  getSettingsService,
  getPublicSettingsService,
  updateSettingsService,
};
