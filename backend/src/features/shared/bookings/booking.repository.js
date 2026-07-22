const Booking = require('./booking.model');
const Unit = require('../units/unit.model');
const Company = require('../companies/company.model');
const Commission = require('../../admin/commissions/commission.model');

const findUnitById = async (unitId) => {
  return Unit.findById(unitId).populate('propertyId');
};

const saveUnit = async (unit) => {
  return unit.save();
};

const createBooking = async (bookingData) => {
  return Booking.create(bookingData);
};

const findBookingById = async (id) => {
  return Booking.findById(id);
};

const findBookingByIdWithRelations = async (id) => {
  return Booking.findById(id)
    .populate('propertyId', 'title category city address price villaDetails landDetails flatTypes')
    .populate('companyId', 'name email phone')
    .populate('customerId', 'name email phone');
};

const saveBooking = async (booking) => {
  return booking.save();
};

const findCustomerBookings = async (customerId) => {
  return Booking.find({ customerId })
    .populate({
      path: 'propertyId',
      select: 'title address city mainImage galleryImages category price villaDetails landDetails flatTypes',
    })
    .populate({
      path: 'unitId',
      select: 'floor unitNumber type price',
    })
    .populate('companyId', 'name phone email')
    .sort('-createdAt');
};

const findCompanyByOwnerId = async (ownerId) => {
  return Company.findOne({ ownerId });
};

const findCompanyBookings = async (companyId) => {
  return Booking.find({ companyId })
    .populate('customerId', 'name email phone avatar')
    .populate('propertyId', 'title')
    .populate('unitId', 'floor unitNumber')
    .sort('-createdAt');
};

const findBookingByUnitAndCustomer = async (unitId, customerId) => {
  return Booking.findOne({ unitId, customerId });
};

const upsertCommission = async (bookingId, data) => {
  return Commission.findOneAndUpdate(
    { bookingId },
    data,
    { upsert: true, new: true }
  );
};

const findBookingsWithQuery = async (query, isAdmin = false) => {
  let dbQuery = Booking.find(query)
    .populate('propertyId', 'title category city')
    .populate('companyId', 'name')
    .populate('customerId', 'name email');

  if (isAdmin) {
    dbQuery = dbQuery.populate('unitId', 'floor unitNumber');
  }

  return dbQuery.sort('-createdAt');
};

const findAutoCancelledBookings = async (query) => {
  return Booking.find(query)
    .populate('propertyId', 'title category city')
    .populate('companyId', 'name')
    .populate('customerId', 'name email phone')
    .populate('unitId', 'floor unitNumber')
    .sort('-cancelledAt');
};

module.exports = {
  findUnitById,
  saveUnit,
  createBooking,
  findBookingById,
  findBookingByIdWithRelations,
  saveBooking,
  findCustomerBookings,
  findCompanyByOwnerId,
  findCompanyBookings,
  findBookingByUnitAndCustomer,
  upsertCommission,
  findBookingsWithQuery,
  findAutoCancelledBookings,
};
