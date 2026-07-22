const Company = require('./company.model');
const User = require('../auth/user.model');

const findCompanyByOwnerId = async (ownerId) => {
  return Company.findOne({ ownerId });
};

const createCompany = async (companyData) => {
  return Company.create(companyData);
};

const findCompaniesWithQuery = async (query) => {
  return Company.find(query)
    .populate('ownerId', 'name email')
    .sort('-createdAt');
};

const findApprovedCompaniesSelectFields = async () => {
  return Company.find({ status: 'approved' })
    .select('name email description location logo')
    .sort('-approvedAt');
};

const findCompanyById = async (id) => {
  return Company.findById(id).populate('ownerId', 'name email');
};

const saveCompany = async (company) => {
  return company.save();
};

const findUserById = async (id) => {
  return User.findById(id);
};

const saveUser = async (user) => {
  return user.save();
};

module.exports = {
  findCompanyByOwnerId,
  createCompany,
  findCompaniesWithQuery,
  findApprovedCompaniesSelectFields,
  findCompanyById,
  saveCompany,
  findUserById,
  saveUser,
};
