const express = require('express');
const {
  getAllRefunds,
  getVendorRefunds,
  completeRefund,
} = require('./refund.controller');
const { protect, authorize } = require('../../../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/vendor', authorize('Company Admin', 'seller'), getVendorRefunds);

router.get('/',             authorize('Super Admin'), getAllRefunds);
router.patch('/:id/complete', authorize('Super Admin'), completeRefund);

module.exports = router;
