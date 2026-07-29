const express = require('express');
const {
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
} = require('./property.controller');
const { protect, authorize }  = require('../../../middleware/auth.middleware');
const { uploadImage }          = require('../../../config/cloudinary');

const router = express.Router();

const propertyUpload = uploadImage.fields([
  { name: 'mainImage',     maxCount: 1  },
  { name: 'galleryImages', maxCount: 10 },
]);

router.get('/approved',           getApprovedProperties);
router.get('/company/:companyId', getCompanyProperties);

router.get(
  '/my',
  protect,
  authorize('Company Admin', 'seller', 'Super Admin'),
  getMyProperties
);

router.get(
  '/all',
  protect,
  authorize('Super Admin'),
  getAllProperties
);

router.get(
  '/pending',
  protect,
  authorize('Super Admin'),
  getPendingProperties
);

router.post(
  '/',
  protect,
  authorize('Company Admin', 'seller', 'Super Admin'),
  propertyUpload,
  createProperty
);

router.put(
  '/:id/status',
  protect,
  authorize('Super Admin'),
  updatePropertyStatus
);

router.patch(
  '/:id/active',
  protect,
  authorize('Company Admin', 'seller', 'Super Admin'),
  toggleActive
);

router.put(
  '/:id',
  protect,
  authorize('Company Admin', 'seller', 'Super Admin'),
  propertyUpload,
  updateProperty
);

router.delete(
  '/:id',
  protect,
  authorize('Company Admin', 'seller', 'Super Admin'),
  deleteProperty
);

router.get('/:id', getSingleProperty);

module.exports = router;
