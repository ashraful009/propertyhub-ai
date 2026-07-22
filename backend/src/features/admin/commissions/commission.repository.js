const Commission = require('./commission.model');
const Company = require('../../shared/companies/company.model');

const aggregateCommissions = async (pipeline) => {
  return Commission.aggregate(pipeline);
};

const findCompanyByIdAndSelect = async (id, selectFields) => {
  return Company.findById(id).select(selectFields).lean();
};

module.exports = {
  aggregateCommissions,
  findCompanyByIdAndSelect,
};
