const express = require('express');
const {
  grantBookingOverride,
  revokeBookingOverride,
  getUsersAtLimit,
  getAuditLog,
  runInactivityScan,
} = require('./admin.controller');
const { protect, authorize } = require('../../../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('Super Admin'));

router.get('/booking-limits',               getUsersAtLimit);
router.post('/users/:id/booking-override',   grantBookingOverride);
router.delete('/users/:id/booking-override', revokeBookingOverride);

router.get('/audit',               getAuditLog);
router.post('/run-inactivity-scan', runInactivityScan);

module.exports = router;
