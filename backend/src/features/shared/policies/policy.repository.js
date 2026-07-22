const Policy = require('./policy.model');

const findPolicyByRoleTarget = async (roleTarget) => {
  return Policy.findOne({ roleTarget });
};

const createPolicy = async (data) => {
  return Policy.create(data);
};

const upsertPolicyInDB = async (roleTarget, title, content) => {
  return Policy.findOneAndUpdate(
    { roleTarget },
    { title: title || 'Terms & Conditions', content },
    { new: true, upsert: true, runValidators: true }
  );
};

module.exports = {
  findPolicyByRoleTarget,
  createPolicy,
  upsertPolicyInDB,
};
