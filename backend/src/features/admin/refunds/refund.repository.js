const RefundRequest = require('./refundRequest.model');
const Booking = require('../../shared/bookings/booking.model');
const Company = require('../../shared/companies/company.model');
const VendorLedger = require('../../vendor/vendorLedger/vendorLedger.model');
const Commission = require('../../admin/commissions/commission.model');
const Unit = require('../../shared/units/unit.model');

const findBookingById = async (id) => {
  return Booking.findById(id)
    .populate('propertyId', 'title category city address')
    .populate('companyId', 'name email')
    .populate('customerId', 'name email');
};

const findCommissionByBookingId = async (bookingId) => {
  return Commission.findOne({ bookingId });
};

const findCompanyById = async (companyId) => {
  return Company.findById(companyId);
};

const findCompanyByOwnerId = async (ownerId) => {
  return Company.findOne({ ownerId });
};

const saveCompany = async (company) => {
  return company.save();
};

const createRefundRequest = async (data) => {
  return RefundRequest.create(data);
};

const createVendorLedger = async (data) => {
  return VendorLedger.create(data);
};

const saveBooking = async (booking) => {
  return booking.save();
};

const findUnitById = async (unitId) => {
  return Unit.findById(unitId);
};

const saveUnit = async (unit) => {
  return unit.save();
};

const updateBookingStatus = async (bookingId, data) => {
  return Booking.findByIdAndUpdate(bookingId, data);
};

const findRefundRequests = async (query) => {
  return RefundRequest.find(query)
    .populate('customerId', 'name email')
    .populate('companyId', 'name email')
    .populate({ path: 'bookingId', select: 'propertyId unitId', populate: { path: 'propertyId', select: 'title' } })
    .sort('-createdAt');
};

const findVendorRefundRequests = async (companyId) => {
  return RefundRequest.find({ companyId })
    .populate('customerId', 'name email')
    .populate({ path: 'bookingId', select: 'propertyId', populate: { path: 'propertyId', select: 'title' } })
    .sort('-createdAt');
};

const findRefundRequestById = async (id) => {
  return RefundRequest.findById(id);
};

const saveRefundRequest = async (refund) => {
  return refund.save();
};

module.exports = {
  findBookingById,
  findCommissionByBookingId,
  findCompanyById,
  findCompanyByOwnerId,
  saveCompany,
  createRefundRequest,
  createVendorLedger,
  saveBooking,
  findUnitById,
  saveUnit,
  updateBookingStatus,
  findRefundRequests,
  findVendorRefundRequests,
  findRefundRequestById,
  saveRefundRequest,
};
