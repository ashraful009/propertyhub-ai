const {
  getSettingsService,
  getPublicSettingsService,
  updateSettingsService,
} = require('./platformSettings.service');
const { successResponse } = require('../../../responses');

const getSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsService();
    return successResponse(res, { settings });
  } catch (error) {
    next(error);
  }
};

const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await getPublicSettingsService();
    return successResponse(res, { settings });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await updateSettingsService(req.body, req.user._id);
    return successResponse(res, { settings }, 'Platform settings updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, getPublicSettings, updateSettings };
