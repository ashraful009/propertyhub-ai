const express = require('express');
const {
  applyForVendor,
  getAllCompanies,
  getApprovedCompanies,
  getCompany,
  getMyCompany,
  updateCompanyStatus,
} = require('./company.controller');
const { protect, authorize } = require('../../../middleware/auth.middleware');
const { uploadDocument }     = require('../../../config/cloudinary');

const router = express.Router();

router.get('/approved', getApprovedCompanies);

router.get('/my', protect, authorize('Company Admin', 'seller'), getMyCompany);

router.get('/:id', getCompany);

router.post(
  '/apply',
  protect,
  uploadDocument.single('tradeLicense'),
  applyForVendor
);

router.get('/', protect, authorize('Super Admin'), getAllCompanies);

router.put('/:id/status', protect, authorize('Super Admin'), updateCompanyStatus);

module.exports = router;
