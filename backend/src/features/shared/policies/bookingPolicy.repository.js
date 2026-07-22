const BookingPolicy = require('./bookingPolicy.model');
const Company = require('../companies/company.model');

const findCompanyByOwnerId = async (ownerId) => {
  return Company.findOne({ ownerId });
};

const findBookingPoliciesByCompanyId = async (companyId) => {
  return BookingPolicy.find({ companyId });
};

const upsertBookingPolicyInDB = async (companyId, category, updateData) => {
  return BookingPolicy.findOneAndUpdate(
    { companyId, category },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );
};

const findBookingPolicyByCompanyAndCategory = async (companyId, category) => {
  return BookingPolicy.findOne({ companyId, category });
};

module.exports = {
  findCompanyByOwnerId,
  findBookingPoliciesByCompanyId,
  upsertBookingPolicyInDB,
  findBookingPolicyByCompanyAndCategory,
};
