import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { InstallmentService } from '../../services/customer/installment.service';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const previewInstallment = (req: Request, res: Response): void => {
  try {
    const { totalDue, totalInstallments } = req.body;

    if (!totalDue || !totalInstallments || totalInstallments > 24 || totalInstallments < 1) {
      return ApiResponse.error(res, ERROR_MESSAGES.INSTALLMENT.INVALID_INPUT, 400);
    }

    const data = InstallmentService.previewInstallment(totalDue, totalInstallments);
    ApiResponse.success(res, RESPONSE_MESSAGES.INSTALLMENT.PREVIEW_GENERATED, data);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const generateInstallments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { booking_id, totalDue, totalInstallments } = req.body;

    if (!booking_id || !totalDue || !totalInstallments) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.MISSING_REQUIRED_FIELDS, 400);
    }

    const plan = await InstallmentService.generateInstallmentPlan(booking_id, totalDue, totalInstallments);
    ApiResponse.success(res, RESPONSE_MESSAGES.INSTALLMENT.SCHEDULE_GENERATED, plan, 201);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const getInstallmentSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { booking_id } = req.params;

    const schedule = await InstallmentService.getSchedule(booking_id as string);

    if (!schedule) {
      return ApiResponse.error(res, ERROR_MESSAGES.INSTALLMENT.SCHEDULE_NOT_FOUND, 404);
    }

    ApiResponse.success(res, RESPONSE_MESSAGES.INSTALLMENT.SCHEDULE_FETCHED, schedule);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};