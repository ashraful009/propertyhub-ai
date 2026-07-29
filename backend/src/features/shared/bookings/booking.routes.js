const express = require('express');
const {
  createBooking,
  getMyBookings,
  getCompanyBookings,
  updateBookingStatus,
  confirmStripeBooking,
  getBookingInvoice,
  getSalesReport,
  getSalesReportPDF,
  checkMyBookingLimit,
  getAutoCancelledBookings,
} = require('./booking.controller');
const { requestRefund } = require('../../admin/refunds/refund.controller');
const { protect, authorize } = require('../../../middleware/auth.middleware');

const router = express.Router();

router.post('/',        protect, createBooking);
router.post('/confirm', protect, confirmStripeBooking);
router.get('/my',       protect, getMyBookings);

router.get('/limit-check', protect, checkMyBookingLimit);

router.post('/:id/request-refund', protect, requestRefund);

router.get('/auto-cancelled', protect, authorize('Super Admin'), getAutoCancelledBookings);

router.get('/:id/invoice', protect, getBookingInvoice);

router.get(
  '/sales-report',
  protect,
  authorize('Company Admin', 'seller', 'Super Admin'),
  getSalesReport
);

router.get(
  '/sales-report/pdf',
  protect,
  authorize('Company Admin', 'seller', 'Super Admin'),
  getSalesReportPDF
);

router.get(
  '/company',
  protect,
  authorize('Company Admin', 'seller'),
  getCompanyBookings
);

router.put(
  '/:id/status',
  protect,
  authorize('Company Admin', 'seller'),
  updateBookingStatus
);

module.exports = router;
