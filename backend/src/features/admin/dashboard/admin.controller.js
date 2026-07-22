const {
  grantBookingOverrideService,
  revokeBookingOverrideService,
  getUsersAtLimitService,
  getAuditLogService,
  runInactivityScanService,
} = require('./admin.service');
const { successResponse } = require('../../../responses');

const grantBookingOverride = async (req, res, next) => {
  try {
    const { overrideLimit, reason } = req.body;
    const { override, user } = await grantBookingOverrideService(req.params.id, overrideLimit, reason, req.user._id);
    return successResponse(res, { override }, `Booking limit override granted: ${user.name} can now hold up to ${overrideLimit} active bookings.`);
  } catch (error) {
    next(error);
  }
};

const revokeBookingOverride = async (req, res, next) => {
  try {
    await revokeBookingOverrideService(req.params.id, req.user._id);
    return successResponse(res, null, 'Override revoked.');
  } catch (error) {
    next(error);
  }
};

const getUsersAtLimit = async (req, res, next) => {
  try {
    const data = await getUsersAtLimitService();
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getAuditLog = async (req, res, next) => {
  try {
    const data = await getAuditLogService(req.query);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const runInactivityScan = async (req, res, next) => {
  try {
    const summary = await runInactivityScanService(req.user._id);
    return successResponse(res, { summary }, 'Inactivity scan completed.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  grantBookingOverride,
  revokeBookingOverride,
  getUsersAtLimit,
  getAuditLog,
  runInactivityScan,
};
