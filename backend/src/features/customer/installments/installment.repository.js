const Installment = require('./installment.model');
const Booking = require('../../shared/bookings/booking.model');
const Unit = require('../../shared/units/unit.model');

const findBookingById = async (id) => {
  return Booking.findById(id);
};

const findBookingByIdWithRelations = async (id) => {
  return Booking.findById(id)
    .populate('propertyId', 'title category city address')
    .populate('companyId', 'name email phone')
    .populate('customerId', 'name email phone');
};

const findInstallmentById = async (id) => {
  return Installment.findById(id);
};

const findInstallmentsByBookingId = async (bookingId) => {
  return Installment.find({ bookingId }).sort({ installmentNumber: 1 });
};

const insertInstallments = async (installments, session) => {
  if (session) {
    return Installment.insertMany(installments, { session });
  }
  return Installment.insertMany(installments);
};

const countPendingInstallments = async (bookingId) => {
  return Installment.countDocuments({ bookingId, status: 'pending' });
};

const saveBooking = async (booking, session) => {
  if (session) {
    return booking.save({ session });
  }
  return booking.save();
};

const saveInstallment = async (installment) => {
  return installment.save();
};

const findUnitById = async (id) => {
  return Unit.findById(id);
};

const saveUnit = async (unit) => {
  return unit.save();
};

module.exports = {
  findBookingById,
  findBookingByIdWithRelations,
  findInstallmentById,
  findInstallmentsByBookingId,
  insertInstallments,
  countPendingInstallments,
  saveBooking,
  saveInstallment,
  findUnitById,
  saveUnit,
};
