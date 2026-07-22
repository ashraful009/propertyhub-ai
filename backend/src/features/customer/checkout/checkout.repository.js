const Unit = require('../../shared/units/unit.model');
const Booking = require('../../shared/bookings/booking.model');
const BookingPolicy = require('../../shared/policies/bookingPolicy.model');

const findUnitById = async (unitId) => {
  return Unit.findById(unitId).populate('propertyId');
};

const saveUnit = async (unit) => {
  return unit.save();
};

const findBookingByUnitAndCustomer = async (unitId, customerId) => {
  return Booking.findOne({ unitId, customerId });
};

const findBookingById = async (bookingId) => {
  return Booking.findById(bookingId).populate('propertyId');
};

const createBooking = async (data) => {
  return Booking.create(data);
};

const saveBooking = async (booking) => {
  return booking.save();
};

const findBookingPolicy = async (companyId, category) => {
  return BookingPolicy.findOne({ companyId, category });
};

module.exports = {
  findUnitById,
  saveUnit,
  findBookingByUnitAndCustomer,
  findBookingById,
  createBooking,
  saveBooking,
  findBookingPolicy,
};
