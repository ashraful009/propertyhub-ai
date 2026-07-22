const {
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
} = require('./property.service');
const { successResponse } = require('../../../responses');

const createProperty = async (req, res, next) => {
  try {
    const property = await createPropertyService(req.body, req.files || {}, req.user);
    const message = req.user.roles.includes('Super Admin')
      ? 'Property published successfully!'
      : 'Property submitted for review. It will go live once approved by admin.';
    return successResponse(res, { property }, message, 201);
  } catch (error) {
    next(error);
  }
};

const updateProperty = async (req, res, next) => {
  try {
    const property = await updatePropertyService(req.params.id, req.body, req.files || {}, req.user);
    return successResponse(res, { property }, 'Property updated');
  } catch (error) {
    next(error);
  }
};

const deleteProperty = async (req, res, next) => {
  try {
    await deletePropertyService(req.params.id, req.user);
    return successResponse(res, null, 'Property and all its units deleted successfully');
  } catch (error) {
    next(error);
  }
};

const toggleActive = async (req, res, next) => {
  try {
    const isActive = await toggleActiveService(req.params.id, req.user);
    return successResponse(res, { isActive }, `Property ${isActive ? 'activated' : 'deactivated'}`);
  } catch (error) {
    next(error);
  }
};

const getPendingProperties = async (req, res, next) => {
  try {
    const properties = await getPendingPropertiesService();
    return successResponse(res, { properties });
  } catch (error) {
    next(error);
  }
};

const updatePropertyStatus = async (req, res, next) => {
  try {
    const { status, rejectedReason } = req.body;
    const property = await updatePropertyStatusService(req.params.id, status, rejectedReason);
    return successResponse(res, { property }, `Property ${status} successfully`);
  } catch (error) {
    next(error);
  }
};

const getApprovedProperties = async (req, res, next) => {
  try {
    const data = await getApprovedPropertiesService(req.query);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getCompanyProperties = async (req, res, next) => {
  try {
    const data = await getCompanyPropertiesService(req.params.companyId);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getMyProperties = async (req, res, next) => {
  try {
    const data = await getMyPropertiesService(req.user._id);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getAllProperties = async (req, res, next) => {
  try {
    const data = await getAllPropertiesService(req.query);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getSingleProperty = async (req, res, next) => {
  try {
    const data = await getSinglePropertyService(req.params.id);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProperty,
  updateProperty,
  deleteProperty,
  toggleActive,
  getPendingProperties,
  updatePropertyStatus,
  getApprovedProperties,
  getCompanyProperties,
  getMyProperties,
  getAllProperties,
  getSingleProperty,
};
