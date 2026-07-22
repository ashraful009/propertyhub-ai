const {
  createBookingService,
  getMyBookingsService,
  getCompanyBookingsService,
  updateBookingStatusService,
  confirmStripeBookingService,
  getBookingInvoiceService,
  getSalesReportService,
  getSalesReportPDFService,
  checkMyBookingLimitService,
  getAutoCancelledBookingsService,
} = require('./booking.service');
const { successResponse } = require('../../../responses');

const createBooking = async (req, res, next) => {
  try {
    const { unitId, message } = req.body;
    const booking = await createBookingService(unitId, message, req.user._id);
    return successResponse(res, { booking }, 'Booking request sent successfully! The company will review it shortly.', 201);
  } catch (error) {
    if (error.details && error.details.code) {
      return res.status(409).json({ success: false, code: error.details.code, message: error.message });
    }
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await getMyBookingsService(req.user._id);
    return successResponse(res, { bookings });
  } catch (error) {
    next(error);
  }
};

const getCompanyBookings = async (req, res, next) => {
  try {
    const bookings = await getCompanyBookingsService(req.user._id);
    return successResponse(res, { bookings });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await updateBookingStatusService(req.params.id, status);
    return successResponse(res, { booking }, `Booking ${status} successfully`);
  } catch (error) {
    next(error);
  }
};

const confirmStripeBooking = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const result = await confirmStripeBookingService(sessionId);
    return successResponse(res, { booking: result.booking }, result.message);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'NotFoundError') {
      next(error);
    } else {
      console.error('Stripe Confirm Error:', error);
      res.status(500).json({ success: false, message: 'Failed to confirm booking from Stripe session' });
    }
  }
};

const getBookingInvoice = async (req, res, next) => {
  try {
    const { pdfBuffer, filename } = await getBookingInvoiceService(req.params.id, req.user._id, req.user.roles);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await getSalesReportService(startDate, endDate, req.user._id, req.user.roles);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const getSalesReportPDF = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const { pdfBuffer, filename } = await getSalesReportPDFService(startDate, endDate, req.user._id, req.user.roles);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

const checkMyBookingLimit = async (req, res, next) => {
  try {
    const { companyId } = req.query;
    const data = await checkMyBookingLimitService(req.user._id, companyId);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getAutoCancelledBookings = async (req, res, next) => {
  try {
    const { reason } = req.query;
    const data = await getAutoCancelledBookingsService(reason);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
