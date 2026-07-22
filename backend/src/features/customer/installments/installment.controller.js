const {
  setupInstallmentPlanService,
  getBookingInstallmentsService,
  createInstallmentPaymentSessionService,
  confirmInstallmentPaymentService,
  downloadInstallmentInvoiceService,
} = require('./installment.service');
const { successResponse } = require('../../../responses');

const setupInstallmentPlan = async (req, res, next) => {
  try {
    const { bookingId, totalInstallments } = req.body;
    const { plan, installments, n } = await setupInstallmentPlanService(bookingId, totalInstallments, req.user._id);
    return successResponse(res, { plan, installments }, `Installment plan created with ${n} installment${n > 1 ? 's' : ''}.`, 201);
  } catch (error) {
    next(error);
  }
};

const getBookingInstallments = async (req, res, next) => {
  try {
    const data = await getBookingInstallmentsService(req.params.bookingId, req.user._id, req.user.roles);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const createInstallmentPaymentSession = async (req, res, next) => {
  try {
    const result = await createInstallmentPaymentSessionService(req.params.id, req.user._id, req.user.email);
    return res.status(200).json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      sessionId: result.sessionId,
      meta: result.meta,
    });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError' || error.name === 'ForbiddenError') {
      next(error);
    } else {
      console.error('Stripe Installment Error:', error);
      res.status(500).json({ success: false, message: 'Failed to create installment payment session.' });
    }
  }
};

const confirmInstallmentPayment = async (req, res, next) => {
  try {
    const { installment, alreadyConfirmed } = await confirmInstallmentPaymentService(req.body.sessionId);
    const message = alreadyConfirmed ? 'Installment already confirmed.' : `Installment ${installment.installmentNumber} confirmed.`;
    return successResponse(res, { installment }, message);
  } catch (error) {
    next(error);
  }
};

const downloadInstallmentInvoice = async (req, res, next) => {
  try {
    const { pdfBuffer, filename } = await downloadInstallmentInvoiceService(req.params.id, req.user._id, req.user.roles);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  setupInstallmentPlan,
  getBookingInstallments,
  createInstallmentPaymentSession,
  confirmInstallmentPayment,
  downloadInstallmentInvoice,
};
