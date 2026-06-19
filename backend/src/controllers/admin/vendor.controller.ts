import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { findAllApplications } from '../../repositories/admin/vendor.repository';
import { AdminVendorService } from '../../services/admin/vendor.service';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const getAllApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await findAllApplications();
    ApiResponse.success(res, RESPONSE_MESSAGES.VENDOR.APPLICATIONS_FETCHED, applications);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const reviewApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, user_id } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return ApiResponse.error(res, ERROR_MESSAGES.VENDOR.INVALID_REVIEW_STATUS, 400);
    }

    await AdminVendorService.reviewApplication(id as string, status, user_id);
    ApiResponse.success(res, RESPONSE_MESSAGES.VENDOR.APPLICATION_REVIEWED(status));
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    ApiResponse.error(res, error.message || ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, statusCode);
  }
};
