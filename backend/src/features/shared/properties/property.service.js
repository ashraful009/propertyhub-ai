const {
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
} = require('./property.repository');
const { generateUnitsForProperty } = require('../units/unit.controller');
const { NotFoundError, ValidationError, ForbiddenError } = require('../../../errors');

const parseFlatTypes = (raw) => {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const parseJsonObject = (raw) => {
  if (!raw) return undefined;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const createPropertyService = async (data, files, user) => {
  const {
    title, description, price, address, city,
    category, totalFloors, unitsPerFloor,
    landSize, handoverTime, totalUnitsCount,
    lat, lng, flatTypes: flatTypesRaw,
    villaDetails: villaDetailsRaw,
    landDetails: landDetailsRaw,
  } = data;

  if (!title || !description || (!price && category !== 'apartment') || !address || !city || !category) {
    throw new ValidationError('All required fields must be filled.');
  }

  const isSuperAdmin = user.roles.includes('Super Admin');
  let company;

  if (isSuperAdmin) {
    company = await findFirstApprovedCompany();
    if (!company) {
      company = await upsertPlatformCompany(user._id, user.email);
    }
  } else {
    company = await findCompanyByOwnerIdAndStatus(user._id, 'approved');
    if (!company) {
      throw new ValidationError('You must have an approved company to list properties. Your company application may still be pending.');
    }
  }

  const mainImageUrl = files.mainImage?.[0]?.path || '';
  const galleryUrls = (files.galleryImages || []).map((f) => f.path);

  const flatTypes = parseFlatTypes(flatTypesRaw);
  const villaDetails = parseJsonObject(villaDetailsRaw);
  const landDetails = parseJsonObject(landDetailsRaw);

  let calculatedPrice = Number(price) || 0;
  if (category === 'apartment' && flatTypes.length > 0) {
    const validPrices = flatTypes.map((f) => Number(f.pricePerUnit) || 0).filter((p) => p > 0);
    if (validPrices.length > 0) calculatedPrice = Math.min(...validPrices);
  }

  const status = isSuperAdmin ? 'approved' : 'pending';
  const approvedAt = isSuperAdmin ? new Date() : undefined;

  const propertyData = {
    title,
    description,
    price: calculatedPrice,
    category,
    mainImage: mainImageUrl,
    galleryImages: galleryUrls,
    companyId: company._id,
    addedBy: user._id,
    address,
    city,
    landSize: landSize || '',
    handoverTime: handoverTime || '',
    totalUnitsCount: Number(totalUnitsCount) || 0,
    totalFloors: Number(totalFloors) || 1,
    unitsPerFloor: Number(unitsPerFloor) || 1,
    flatTypes,
    location: {
      lat: parseFloat(lat) || 0,
      lng: parseFloat(lng) || 0,
    },
    status,
    approvedAt,
  };

  if (category === 'villa' && villaDetails) propertyData.villaDetails = villaDetails;
  if (category === 'land' && landDetails) propertyData.landDetails = landDetails;

  const property = await createProperty(propertyData);

  if (isSuperAdmin) {
    await generateUnitsForProperty(property);
  }

  return property;
};

const updatePropertyService = async (id, data, files, user) => {
  const property = await findPropertyById(id);
  if (!property) {
    throw new NotFoundError('Property not found');
  }

  if (!user.roles.includes('Super Admin') && String(property.addedBy) !== String(user._id)) {
    throw new ForbiddenError('Not authorized to edit this property');
  }

  const {
    title, description, price, address, city, category,
    totalFloors, unitsPerFloor, landSize, handoverTime,
    totalUnitsCount, lat, lng, flatTypes: flatTypesRaw,
    villaDetails: villaDetailsRaw,
    landDetails: landDetailsRaw,
  } = data;

  if (title) property.title = title;
  if (description) property.description = description;
  if (address) property.address = address;
  if (city) property.city = city;
  if (category) property.category = category;
  if (totalFloors) property.totalFloors = Number(totalFloors);
  if (unitsPerFloor) property.unitsPerFloor = Number(unitsPerFloor);
  if (landSize !== undefined) property.landSize = landSize;
  if (handoverTime !== undefined) property.handoverTime = handoverTime;
  if (totalUnitsCount) property.totalUnitsCount = Number(totalUnitsCount);
  if (lat) property.location.lat = parseFloat(lat);
  if (lng) property.location.lng = parseFloat(lng);
  if (flatTypesRaw) property.flatTypes = parseFlatTypes(flatTypesRaw);
  if (villaDetailsRaw) property.villaDetails = parseJsonObject(villaDetailsRaw);
  if (landDetailsRaw) property.landDetails = parseJsonObject(landDetailsRaw);

  if (property.category === 'apartment' && property.flatTypes?.length > 0) {
    const validPrices = property.flatTypes.map((f) => Number(f.pricePerUnit) || 0).filter((p) => p > 0);
    if (validPrices.length > 0) {
      property.price = Math.min(...validPrices);
    }
  } else if (price) {
    property.price = Number(price);
  }

  if (files.mainImage?.[0]) {
    property.mainImage = files.mainImage[0].path;
  }
  if (files.galleryImages?.length) {
    property.galleryImages = files.galleryImages.map((f) => f.path);
  }

  await saveProperty(property);
  return property;
};

const deletePropertyService = async (id, user) => {
  const property = await findPropertyById(id);
  if (!property) {
    throw new NotFoundError('Property not found');
  }

  if (!user.roles.includes('Super Admin') && String(property.addedBy) !== String(user._id)) {
    throw new ForbiddenError('Not authorized to delete this property');
  }

  await deleteUnitsByPropertyId(property._id);
  await deleteProperty(property);
};

const toggleActiveService = async (id, user) => {
  const property = await findPropertyById(id);
  if (!property) {
    throw new NotFoundError('Property not found');
  }

  if (!user.roles.includes('Super Admin') && String(property.addedBy) !== String(user._id)) {
    throw new ForbiddenError('Not authorized');
  }

  property.isActive = !property.isActive;
  await saveProperty(property);
  return property.isActive;
};

const getPendingPropertiesService = async () => {
  return findPendingProperties();
};

const updatePropertyStatusService = async (id, status, rejectedReason) => {
  if (!['approved', 'rejected'].includes(status)) {
    throw new ValidationError('Invalid status');
  }

  const property = await findPropertyById(id);
  if (!property) {
    throw new NotFoundError('Property not found');
  }

  property.status = status;
  property.rejectedReason = rejectedReason || '';
  if (status === 'approved') {
    property.approvedAt = new Date();
    await generateUnitsForProperty(property);
  }

  await saveProperty(property);
  return property;
};

const getApprovedPropertiesService = async (query) => {
  const { city, category, limit = 12, page = 1 } = query;
  const filter = { status: 'approved', isActive: true };
  if (city) filter.city = new RegExp(city, 'i');
  if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);
  const properties = await findApprovedPropertiesWithFilters(filter, skip, Number(limit));

  const policyKeys = [...new Set(properties.map((p) => `${p.companyId?._id || p.companyId}_${p.category}`))];
  const policyConditions = policyKeys.map((key) => {
    const [companyId, cat] = key.split('_');
    return { companyId, category: cat };
  });

  const policies = policyConditions.length ? await findBookingPoliciesByConditions(policyConditions) : [];
  const policyMap = {};
  policies.forEach((p) => {
    policyMap[`${p.companyId}_${p.category}`] = p.bookingMoneyPercentage;
  });

  const villaOrLandPropIds = properties.filter((p) => p.category === 'villa' || p.category === 'land').map((p) => p._id);
  const units = villaOrLandPropIds.length ? await findUnitsByPropertyIds(villaOrLandPropIds) : [];
  const unitStatusMap = {};
  units.forEach((u) => {
    unitStatusMap[u.propertyId.toString()] = u.status;
  });

  const enriched = properties.map((p) => {
    const key = `${p.companyId?._id || p.companyId}_${p.category}`;
    const pct = policyMap[key] || 20;
    return {
      ...p,
      bookingMoneyPercentage: pct,
      bookingMoneyAmount: Math.round(p.price * pct / 100),
      unitStatus: unitStatusMap[p._id.toString()] || 'available',
    };
  });

  const total = await countProperties(filter);
  return { properties: enriched, total, page: Number(page), limit: Number(limit) };
};

const getCompanyPropertiesService = async (companyId) => {
  const properties = await findCompanyProperties(companyId);

  const villaOrLandPropIds = properties.filter((p) => p.category === 'villa' || p.category === 'land').map((p) => p._id);
  const units = villaOrLandPropIds.length ? await findUnitsByPropertyIds(villaOrLandPropIds) : [];
  const unitStatusMap = {};
  units.forEach((u) => {
    unitStatusMap[u.propertyId.toString()] = u.status;
  });

  const enriched = properties.map((p) => ({
    ...p,
    unitStatus: unitStatusMap[p._id.toString()] || 'available',
  }));

  return { properties: enriched };
};

const getMyPropertiesService = async (userId) => {
  const properties = await findPropertiesByAddedBy(userId);
  return { properties };
};

const getAllPropertiesService = async (query) => {
  const { status, category, page = 1, limit = 20 } = query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);
  const properties = await findAllProperties(filter, skip, Number(limit));
  const total = await countProperties(filter);

  return { properties, total };
};

const getSinglePropertyService = async (id) => {
  const property = await findPropertyByIdWithRelations(id);
  if (!property) {
    throw new NotFoundError('Property not found');
  }

  let unitStatus = 'available';
  if (property.category === 'villa' || property.category === 'land') {
    const unit = await findUnitByPropertyId(property._id);
    if (unit) {
      unitStatus = unit.status;
    }
  }

  return { property: { ...property, unitStatus } };
};

module.exports = {
  createPropertyService,
  updatePropertyService,
  deletePropertyService,
  toggleActiveService,
  getPendingPropertiesService,
  updatePropertyStatusService,
  getApprovedPropertiesService,
  getCompanyPropertiesService,
  getMyPropertiesService,
  getAllPropertiesService,
  getSinglePropertyService,
};
