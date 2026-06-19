import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { RefundService } from '../../services/customer/refund.service';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const requestCancellation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { booking_id } = req.body;

    if (!userId || !booking_id) {
      return ApiResponse.error(res, ERROR_MESSAGES.REFUND.MISSING_BOOKING_ID, 400);
    }

    const refundDetails = await RefundService.requestCancellation(booking_id, userId);
    ApiResponse.success(res, RESPONSE_MESSAGES.REFUND.CANCELED_WITH_PENALTY, refundDetails);
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    ApiResponse.error(res, error.message || ERROR_MESSAGES.REFUND.CANCELLATION_FAILED, statusCode);
  }
};

export const triggerAutoCancellation = async (req: Request, res: Response): Promise<void> => {
  try {
    const canceledCount = await RefundService.autoCancelDefaults();
    ApiResponse.success(res, RESPONSE_MESSAGES.REFUND.AUTO_CANCELED(canceledCount));
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};