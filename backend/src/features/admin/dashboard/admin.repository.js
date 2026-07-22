const Booking = require('../../shared/bookings/booking.model');
const User = require('../../shared/auth/user.model');
const BookingLimitOverride = require('../../shared/overrides/bookingLimitOverride.model');
const AuditLog = require('../../shared/audit/auditLog.model');

const findUserByIdAndSelect = async (id, selectFields) => {
  return User.findById(id).select(selectFields);
};

const upsertBookingOverride = async (userId, overrideData) => {
  return BookingLimitOverride.findOneAndUpdate(
    { userId },
    overrideData,
    { new: true, upsert: true, runValidators: true }
  );
};

const deleteBookingOverride = async (userId) => {
  return BookingLimitOverride.findOneAndDelete({ userId });
};

const aggregateActiveBookings = async (activeStatusFilter) => {
  return Booking.aggregate([
    { $match: activeStatusFilter },
    { $group: { _id: '$customerId', activeCount: { $sum: 1 } } },
    { $sort: { activeCount: -1 } },
  ]);
};

const findAllOverrides = async () => {
  return BookingLimitOverride.find().lean();
};

const findUsersByIdsAndSelect = async (userIds, selectFields) => {
  return User.find({ _id: { $in: userIds } }).select(selectFields).lean();
};

const findAuditLogsWithQuery = async (query, limit) => {
  return AuditLog.find(query)
    .populate('userId', 'name email')
    .populate('performedBy', 'name email')
    .sort('-createdAt')
    .limit(limit);
};

module.exports = {
  findUserByIdAndSelect,
  upsertBookingOverride,
  deleteBookingOverride,
  aggregateActiveBookings,
  findAllOverrides,
  findUsersByIdsAndSelect,
  findAuditLogsWithQuery,
};
