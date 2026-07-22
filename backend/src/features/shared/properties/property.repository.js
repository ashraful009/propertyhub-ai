const Property = require('./property.model');
const Company = require('../companies/company.model');
const Unit = require('../units/unit.model');
const BookingPolicy = require('../policies/bookingPolicy.model');

const findCompanyByOwnerIdAndStatus = async (ownerId, status) => {
  return Company.findOne({ ownerId, status });
};

const findFirstApprovedCompany = async () => {
  return Company.findOne({ status: 'approved' });
};

const upsertPlatformCompany = async (ownerId, email) => {
  return Company.findOneAndUpdate(
    { name: 'FlatSell Platform', ownerId },
    {
      $setOnInsert: {
        name: 'FlatSell Platform',
        email,
        phone: '00000000000',
        description: 'Official FlatSell platform listings managed by Super Admin.',
        tradeLicense: 'system',
        ownerId,
        status: 'approved',
        approvedAt: new Date(),
        location: { address: '', lat: 0, lng: 0 },
      },
    },
    { upsert: true, new: true }
  );
};

const createProperty = async (data) => {
  return Property.create(data);
};

const findPropertyById = async (id) => {
  return Property.findById(id);
};

const saveProperty = async (property) => {
  return property.save();
};

const deleteUnitsByPropertyId = async (propertyId) => {
  return Unit.deleteMany({ propertyId });
};

const deleteProperty = async (property) => {
  return property.deleteOne();
};

const findPendingProperties = async () => {
  return Property.find({ status: 'pending' })
    .populate('companyId', 'name email')
    .populate('addedBy', 'name email')
    .sort('-createdAt');
};

const findApprovedPropertiesWithFilters = async (filter, skip, limit) => {
  return Property.find(filter)
    .populate('companyId', 'name logo')
    .sort('-approvedAt')
    .skip(skip)
    .limit(limit)
    .lean();
};

const countProperties = async (filter) => {
  return Property.countDocuments(filter);
};

const findBookingPoliciesByConditions = async (conditions) => {
  return BookingPolicy.find({ $or: conditions }).lean();
};

const findUnitsByPropertyIds = async (propertyIds) => {
  return Unit.find({ propertyId: { $in: propertyIds } }).lean();
};

const findCompanyProperties = async (companyId) => {
  return Property.find({
    companyId,
    status: 'approved',
    isActive: true,
  })
    .populate('companyId', 'name logo')
    .sort('-approvedAt')
    .lean();
};

const findPropertiesByAddedBy = async (addedBy) => {
  return Property.find({ addedBy })
    .populate('companyId', 'name')
    .sort('-createdAt');
};

const findAllProperties = async (filter, skip, limit) => {
  return Property.find(filter)
    .populate('companyId', 'name logo')
    .populate('addedBy', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);
};

const findPropertyByIdWithRelations = async (id) => {
  return Property.findById(id)
    .populate('companyId', 'name logo email phone location')
    .populate('addedBy', 'name email')
    .lean();
};

const findUnitByPropertyId = async (propertyId) => {
  return Unit.findOne({ propertyId }).lean();
};

module.exports = {
  findCompanyByOwnerIdAndStatus,
  findFirstApprovedCompany,
  upsertPlatformCompany,
  createProperty,
  findPropertyById,
  saveProperty,
  deleteUnitsByPropertyId,
  deleteProperty,
  findPendingProperties,
  findApprovedPropertiesWithFilters,
  countProperties,
  findBookingPoliciesByConditions,
  findUnitsByPropertyIds,
  findCompanyProperties,
  findPropertiesByAddedBy,
  findAllProperties,
  findPropertyByIdWithRelations,
  findUnitByPropertyId,
};
