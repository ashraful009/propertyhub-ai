const {
  getMyBookingPoliciesService,
  upsertBookingPolicyService,
  getBookingPolicyByCompanyAndCategoryService,
} = require('./bookingPolicy.service');
const { successResponse } = require('../../../responses');

const getMyBookingPolicies = async (req, res, next) => {
  try {
    const data = await getMyBookingPoliciesService(req.user._id);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const upsertBookingPolicy = async (req, res, next) => {
  try {
    const policy = await upsertBookingPolicyService(req.params.category, req.body, req.user._id);
    return successResponse(res, { policy }, `Booking policy for "${req.params.category}" updated successfully`);
  } catch (error) {
    next(error);
  }
};

const getBookingPolicyByCompanyAndCategory = async (req, res, next) => {
  try {
    const data = await getBookingPolicyByCompanyAndCategoryService(req.params.companyId, req.params.category);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyBookingPolicies,
  upsertBookingPolicy,
  getBookingPolicyByCompanyAndCategory,
};
