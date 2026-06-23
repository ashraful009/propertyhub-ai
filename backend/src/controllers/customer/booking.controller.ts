import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { insertBooking, findBookingByUser, updateBookingStatusInDb } from '../../repositories/customer/booking.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';
import { InstallmentService } from '../../services/customer/installment.service';
import { findPropertyById } from '../../repositories/shared/property.repository';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customer_id = req.user?.id;
    const { property_id, vendor_id, booking_amount, installment_duration_months, applicant_info, nominee_info } = req.body;

    if (!customer_id || req.user?.role !== 'CUSTOMER') {
      return ApiResponse.error(res, ERROR_MESSAGES.BOOKING.CUSTOMER_ONLY, 403);
    }

    const property = await findPropertyById(property_id);
    if (!property) {
      return ApiResponse.error(res, 'Property not found', 404);
    }

    const newBooking = await insertBooking(property_id, customer_id, vendor_id, booking_amount, applicant_info, nominee_info);
    
    // Generate Installment Plan
    const remainingBalance = Number(property.price) - Number(booking_amount);
    if (remainingBalance > 0 && installment_duration_months) {
      await InstallmentService.generateInstallmentPlan(newBooking.id, remainingBalance, installment_duration_months);
    }

    ApiResponse.success(res, RESPONSE_MESSAGES.BOOKING.CREATED, newBooking, 201);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.UNAUTHORIZED, 401);
    }

    const bookings = await findBookingByUser(userId);
    ApiResponse.success(res, RESPONSE_MESSAGES.BOOKING.FETCHED, bookings);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedBooking = await updateBookingStatusInDb(id as string, status);

    if (!updatedBooking) {
      return ApiResponse.error(res, ERROR_MESSAGES.BOOKING.NOT_FOUND, 404);
    }

    ApiResponse.success(res, RESPONSE_MESSAGES.BOOKING.STATUS_UPDATED(status), updatedBooking);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};