const mongoose = require("mongoose");
const {
  requestRefundService,
  getAllRefundsService,
  getVendorRefundsService,
  completeRefundService,
} = require("./refund.service");
const { successResponse } = require("../../../responses");
const { ValidationError } = require("../../../errors");

const requestRefund = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid booking id.");
    }

    const result = await requestRefundService(id, req.user._id);

    return successResponse(
      res,
      { refund: result.refund, booking: result.booking },
      `Refund approved. ৳${result.refundAmount.toLocaleString()} (80%) will be refunded; ৳${result.retentionAmount.toLocaleString()} (${result.retentionPct}%) is retained.`,
    );
  } catch (error) {
    next(error);
  }
};

const getAllRefunds = async (req, res, next) => {
  try {
    const { status } = req.query;
    const result = await getAllRefundsService(status);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const getVendorRefunds = async (req, res, next) => {
  try {
    const result = await getVendorRefundsService(req.user._id);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const completeRefund = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid refund id.");
    }

    const refund = await completeRefundService(id, req.user._id);
    return successResponse(res, { refund }, "Refund marked as completed.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestRefund,
  getAllRefunds,
  getVendorRefunds,
  completeRefund,
};
