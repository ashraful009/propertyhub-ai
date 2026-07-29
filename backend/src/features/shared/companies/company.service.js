const {
  findCompanyByOwnerId,
  createCompany,
  findCompaniesWithQuery,
  findApprovedCompaniesSelectFields,
  findCompanyById,
  saveCompany,
  findUserById,
  saveUser,
} = require('./company.repository');
const { sendVendorApprovalEmail } = require('../../../utils/sendEmail');
const { ValidationError, ConflictError, NotFoundError } = require('../../../errors');

const applyForVendorService = async (data, file, userId) => {
  const { name, email, phone, description, lat, lng, address } = data;

  if (!name || !email || !phone || !description) {
    throw new ValidationError('Company name, email, phone and description are required');
  }

  if (!file) {
    throw new ValidationError('Trade License document is required (PDF or Image)');
  }

  const existingApplication = await findCompanyByOwnerId(userId);
  if (existingApplication) {
    throw new ConflictError(`You already have a ${existingApplication.status} application. Please wait for review.`);
  }

  const tradeLicenseUrl = file.path;

  const company = await createCompany({
    name,
    email,
    phone,
    description,
    location: {
      address: address || '',
      lat: parseFloat(lat) || 0,
      lng: parseFloat(lng) || 0,
    },
    tradeLicense: tradeLicenseUrl,
    ownerId: userId,
  });

  return company;
};

const getAllCompaniesService = async (status) => {
  const filter = status ? { status } : {};
  return findCompaniesWithQuery(filter);
};

const getApprovedCompaniesService = async () => {
  return findApprovedCompaniesSelectFields();
};

const getCompanyService = async (id) => {
  const company = await findCompanyById(id);
  if (!company) {
    throw new NotFoundError('Company not found');
  }
  return company;
};

const getMyCompanyService = async (userId) => {
  const company = await findCompanyByOwnerId(userId);
  if (!company) {
    throw new NotFoundError('No company found for this user.');
  }
  return company;
};

const updateCompanyStatusService = async (id, status, rejectedReason) => {
  if (!['approved', 'rejected'].includes(status)) {
    throw new ValidationError('Status must be approved or rejected');
  }

  const company = await findCompanyById(id);
  if (!company) {
    throw new NotFoundError('Company not found');
  }

  company.status = status;
  company.rejectedReason = rejectedReason || '';
  let emailSent = false;

  if (status === 'approved') {
    company.approvedAt = new Date();

    const user = await findUserById(company.ownerId._id);
    if (user && !user.roles.includes('Company Admin')) {
      user.roles.push('Company Admin');
      await saveUser(user);
    }

    const ownerEmail = company.ownerId?.email;
    const companyEmail = company.email;
    const vendorEmail = ownerEmail || companyEmail;
    const vendorName = company.ownerId?.name || 'Vendor';

    try {
      await sendVendorApprovalEmail({
        vendorName,
        companyName: company.name,
        vendorEmail,
      });
      emailSent = true;
    } catch (emailErr) {
      console.error(` Failed to send vendor approval email to ${vendorEmail}:`, emailErr.message);
    }
  }

  await saveCompany(company);

  return { company, emailSent };
};

module.exports = {
  applyForVendorService,
  getAllCompaniesService,
  getApprovedCompaniesService,
  getCompanyService,
  getMyCompanyService,
  updateCompanyStatusService,
};
