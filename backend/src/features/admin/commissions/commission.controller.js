const {
  getPlatformOverviewService,
  getCompanyBreakdownService,
  getPropertyBreakdownService,
  getMarginReportPDFService,
} = require('./commission.service');
const { successResponse } = require('../../../responses');

const getPlatformOverview = async (req, res, next) => {
  try {
    const data = await getPlatformOverviewService(req.query);
    return successResponse(res, data);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getCompanyBreakdown = async (req, res, next) => {
  try {
    const data = await getCompanyBreakdownService(req.query);
    return successResponse(res, { companies: data });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getPropertyBreakdown = async (req, res, next) => {
  try {
    const data = await getPropertyBreakdownService(req.params.companyId);
    return successResponse(res, { properties: data });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getMarginReportPDF = async (req, res, next) => {
  try {
    const { pdfBuffer, filename } = await getMarginReportPDFService(req.query);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  getPlatformOverview,
  getCompanyBreakdown,
  getPropertyBreakdown,
  getMarginReportPDF,
};
