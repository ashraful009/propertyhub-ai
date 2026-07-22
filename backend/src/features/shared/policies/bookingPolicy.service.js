const {
  findCompanyByOwnerId,
  findBookingPoliciesByCompanyId,
  upsertBookingPolicyInDB,
  findBookingPolicyByCompanyAndCategory,
} = require('./bookingPolicy.repository');
const { ForbiddenError, ValidationError } = require('../../../errors');

const getMyBookingPoliciesService = async (userId) => {
  const company = await findCompanyByOwnerId(userId);
  if (!company) {
    throw new ForbiddenError('Company not found for this user');
  }

  const policies = await findBookingPoliciesByCompanyId(company._id);
  const result = { apartment: null, villa: null, land: null };
  policies.forEach((p) => {
    result[p.category] = p;
  });

  return { policies: result, companyId: company._id };
};

const upsertBookingPolicyService = async (category, data, userId) => {
  if (!['apartment', 'villa', 'land'].includes(category)) {
    throw new ValidationError('Invalid category. Must be apartment, villa, or land.');
  }

  const company = await findCompanyByOwnerId(userId);
  if (!company) {
    throw new ForbiddenError('Company not found for this user');
  }

  const { bookingMoneyPercentage, requiredFields } = data;
  const updateData = {};
  if (bookingMoneyPercentage !== undefined) {
    updateData.bookingMoneyPercentage = Math.max(1, Math.min(100, Number(bookingMoneyPercentage)));
  }
  if (requiredFields && typeof requiredFields === 'object') {
    updateData.requiredFields = requiredFields;
  }

  const policy = await upsertBookingPolicyInDB(company._id, category, updateData);
  return policy;
};

const getBookingPolicyByCompanyAndCategoryService = async (companyId, category) => {
  if (!['apartment', 'villa', 'land'].includes(category)) {
    throw new ValidationError('Invalid category');
  }

  const policy = await findBookingPolicyByCompanyAndCategory(companyId, category);

  if (!policy) {
    return {
      policy: {
        companyId,
        category,
        bookingMoneyPercentage: 20,
        requiredFields: {},
      },
    };
  }

  return { policy };
};

module.exports = {
  getMyBookingPoliciesService,
  upsertBookingPolicyService,
  getBookingPolicyByCompanyAndCategoryService,
};
