const express = require('express');
const router = express.Router();
const { protect } = require('../../../middleware/auth.middleware');
const { uploadBookingDocs } = require('../../../config/cloudinary');
const {
  createCheckoutSession,
  createDuePaymentSession,
  uploadBookingDocuments,
} = require('./checkout.controller');

router.use(protect);

router.post('/upload-documents', uploadBookingDocs.any(), uploadBookingDocuments);

router.post('/create-session', createCheckoutSession);
router.post('/create-due-session', createDuePaymentSession);

module.exports = router;
