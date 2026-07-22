const { getPolicyService, upsertPolicyService } = require('./policy.service');
const { successResponse } = require('../../../responses');

const getPolicy = async (req, res, next) => {
  try {
    const policy = await getPolicyService(req.params.roleTarget);
    return successResponse(res, { policy });
  } catch (error) {
    next(error);
  }
};

const upsertPolicy = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const policy = await upsertPolicyService(req.params.roleTarget, title, content);
    return successResponse(res, { policy }, 'Policy updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getPolicy, upsertPolicy };
