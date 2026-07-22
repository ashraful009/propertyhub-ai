const mongoose = require('mongoose');
const {
  findUserByIdAndSelect,
  upsertBookingOverride,
  deleteBookingOverride,
  aggregateActiveBookings,
  findAllOverrides,
  findUsersByIdsAndSelect,
  findAuditLogsWithQuery,
} = require('./admin.repository');
const PlatformSettings = require('../../admin/settings/platformSettings.model');
const { logAudit } = require('../../shared/audit/audit.service');
const { ACTIVE_STATUS_FILTER } = require('../../shared/bookings/bookingLimits.service');
const { runAutoCancelInactiveBookings } = require('../../../jobs/autoCancelInactiveBookings');
const { NotFoundError, ValidationError } = require('../../../errors');

const grantBookingOverrideService = async (userId, overrideLimit, reason, adminId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ValidationError('Invalid user id.');
  }

  const limit = Number(overrideLimit);
  if (!Number.isInteger(limit) || limit < 1) {
    throw new ValidationError('overrideLimit must be a positive integer.');
  }

  const user = await findUserByIdAndSelect(userId, 'name email');
  if (!user) {
    throw new NotFoundError('User not found.');
  }

  const override = await upsertBookingOverride(userId, {
    overrideLimit: limit,
    grantedBy: adminId,
    grantedAt: new Date(),
    reason: reason || '',
  });

  await logAudit({
    action: 'booking_limit_override_granted',
    userId,
    performedBy: adminId,
    notes: `Override limit set to ${limit}. Reason: ${reason || '—'}`,
    meta: { overrideLimit: limit },
  });

  return { override, user };
};

const revokeBookingOverrideService = async (userId, adminId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ValidationError('Invalid user id.');
  }

  const removed = await deleteBookingOverride(userId);
  if (!removed) {
    throw new NotFoundError('No override exists for this user.');
  }

  await logAudit({
    action: 'booking_limit_override_revoked',
    userId,
    performedBy: adminId,
    notes: 'Booking limit override revoked.',
  });
};

const getUsersAtLimitService = async () => {
  const settings = await PlatformSettings.getSettings();
  const baseLimit = settings.maxTotalActiveBookings;

  const grouped = await aggregateActiveBookings(ACTIVE_STATUS_FILTER);

  const overrides = await findAllOverrides();
  const overrideMap = new Map(overrides.map((o) => [String(o.userId), o]));

  const userIds = grouped.map((g) => g._id);
  const users = await findUsersByIdsAndSelect(userIds, 'name email phone');
  const userMap = new Map(users.map((u) => [String(u._id), u]));

  const result = grouped
    .map((g) => {
      const ov = overrideMap.get(String(g._id));
      const limit = ov ? ov.overrideLimit : baseLimit;
      return {
        userId: g._id,
        user: userMap.get(String(g._id)) || null,
        activeCount: g.activeCount,
        limit,
        hasOverride: !!ov,
        overrideLimit: ov ? ov.overrideLimit : null,
        atLimit: g.activeCount >= limit,
      };
    })
    .filter((r) => r.atLimit);

  return { users: result, baseLimit, count: result.length };
};

const getAuditLogService = async (query) => {
  const { action } = query;
  const limit = Math.min(Number(query.limit) || 100, 500);

  const dbQuery = {};
  if (action) dbQuery.action = action;

  const logs = await findAuditLogsWithQuery(dbQuery, limit);
  return { logs, count: logs.length };
};

const runInactivityScanService = async (adminId) => {
  const summary = await runAutoCancelInactiveBookings();
  await logAudit({
    action: 'inactivity_scan_manual_run',
    performedBy: adminId,
    notes: `Manual inactivity scan. ${JSON.stringify(summary)}`,
    meta: summary,
  });
  return summary;
};

module.exports = {
  grantBookingOverrideService,
  revokeBookingOverrideService,
  getUsersAtLimitService,
  getAuditLogService,
  runInactivityScanService,
};
