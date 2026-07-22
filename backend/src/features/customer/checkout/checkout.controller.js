const {
  createCheckoutSessionService,
  createDuePaymentSessionService,
  processUploadedDocuments,
} = require('./checkout.service');
const { successResponse } = require('../../../responses');

const createCheckoutSession = async (req, res, next) => {
  try {
    const result = await createCheckoutSessionService(req.body, req.user._id, req.user.email);
    return res.status(200).json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId,
    });
  } catch (error) {
    if (error.details && error.details.code) {
      return res.status(409).json({ success: false, code: error.details.code, message: error.message });
    }
    if (error.name === 'ValidationError' || error.name === 'NotFoundError') {
      next(error);
    } else {
      console.error('Stripe Error:', error);
      res.status(500).json({ success: false, message: 'Failed to create checkout session. Check Stripe API Keys.' });
    }
  }
};

const createDuePaymentSession = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const result = await createDuePaymentSessionService(bookingId, req.user._id, req.user.email);
    return res.status(200).json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId,
    });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError' || error.name === 'ForbiddenError') {
      next(error);
    } else {
      console.error('Stripe Due Payment Error:', error);
      res.status(500).json({ success: false, message: 'Failed to create due payment session.' });
    }
  }
};

const uploadBookingDocuments = async (req, res, next) => {
  try {
    const documents = processUploadedDocuments(req.files);
    return successResponse(res, { documents });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  createDuePaymentSession,
  uploadBookingDocuments,
};
