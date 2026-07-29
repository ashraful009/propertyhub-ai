const express = require('express');
const {
  getPropertyUnits,
  getUnit,
  updateUnitStatus,
  updateUnit,
} = require('./unit.controller');
const { protect, authorize } = require('../../../middleware/auth.middleware');

const router = express.Router();

router.get('/property/:propertyId', getPropertyUnits);

router.get('/:id', getUnit);

router.put(
  '/:id/status',
  protect,
  authorize('Company Admin', 'seller', 'Super Admin'),
  updateUnitStatus
);

router.put(
  '/:id',
  protect,
  authorize('Company Admin', 'seller'),
  updateUnit
);

module.exports = router;
