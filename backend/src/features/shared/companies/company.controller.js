const {
  applyForVendorService,
  getAllCompaniesService,
  getApprovedCompaniesService,
  getCompanyService,
  getMyCompanyService,
  updateCompanyStatusService,
} = require('./company.service');
const { successResponse } = require('../../../responses');

const applyForVendor = async (req, res, next) => {
  try {
    const company = await applyForVendorService(req.body, req.file, req.user._id);
    return successResponse(res, { company }, 'Your vendor application has been submitted! We will review it within 3–5 business days.', 201);
  } catch (error) {
    next(error);
  }
};

const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await getAllCompaniesService(req.query.status);
    return successResponse(res, { companies });
  } catch (error) {
    next(error);
  }
};

const getApprovedCompanies = async (req, res, next) => {
  try {
    const companies = await getApprovedCompaniesService();
    return successResponse(res, { companies });
  } catch (error) {
    next(error);
  }
};

const getCompany = async (req, res, next) => {
  try {
    const company = await getCompanyService(req.params.id);
    return successResponse(res, { company });
  } catch (error) {
    next(error);
  }
};

const getMyCompany = async (req, res, next) => {
  try {
    const company = await getMyCompanyService(req.user._id);
    return successResponse(res, { company });
  } catch (error) {
    next(error);
  }
};

const updateCompanyStatus = async (req, res, next) => {
  try {
    const { status, rejectedReason } = req.body;
    const { company, emailSent } = await updateCompanyStatusService(req.params.id, status, rejectedReason);

    const emailMsg = status === 'approved'
      ? (emailSent ? '. Approval email sent to vendor.' : '. Warning: Approval email could not be sent.')
      : '';

    return successResponse(res, { company }, `Company ${status} successfully${emailMsg}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForVendor,
  getAllCompanies,
  getApprovedCompanies,
  getCompany,
  getMyCompany,
  updateCompanyStatus,
};
