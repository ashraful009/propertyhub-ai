const PlatformSettings = require('./platformSettings.model');

const getPlatformSettings = async () => {
  return PlatformSettings.getSettings();
};

const savePlatformSettings = async (settings) => {
  return settings.save();
};

module.exports = {
  getPlatformSettings,
  savePlatformSettings,
};
