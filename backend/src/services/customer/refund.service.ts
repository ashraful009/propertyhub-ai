import pool from '../../database/db';
import { AppError } from '../../errors/AppError';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { getBookingByIdAndUser, updateBookingStatus, updatePropertyStatus } from '../../repositories/customer/booking.repository';
import { getTotalPaidForBooking } from '../../repositories/customer/payment.repository';
import { insertRefund, getUnpaidBookingsOlderThanTwoMonths } from '../../repositories/customer/refund.repository';

export class RefundService {
  static async requestCancellation(bookingId: string, userId: string): Promise<any> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const booking = await getBookingByIdAndUser(client, bookingId, userId);
      if (!booking || booking.status !== 'CONFIRMED') {
        throw new AppError(ERROR_MESSAGES.BOOKING.NOT_FOUND_OR_CANCELED, 404);
      }

      const bookingDate = new Date(booking.created_at);
      const currentDate = new Date();
      const differenceInDays = (currentDate.getTime() - bookingDate.getTime()) / (1000 * 3600 * 24);

      if (differenceInDays > 30) {
        throw new AppError(ERROR_MESSAGES.REFUND.CANCELLATION_EXPIRED, 400);
      }

      const totalPaid = await getTotalPaidForBooking(client, bookingId);
      if (totalPaid === 0) {
        throw new AppError(ERROR_MESSAGES.REFUND.NO_PAYMENT_TO_REFUND, 400);
      }

      const penaltyAmount = totalPaid * 0.10;
      const refundAmount = totalPaid - penaltyAmount;

      const refundData = await insertRefund(client, bookingId, totalPaid, penaltyAmount, refundAmount);

      await updateBookingStatus(client, bookingId, 'CANCELED');
      await updatePropertyStatus(client, booking.property_id, 'AVAILABLE');

      await client.query('COMMIT');
      return refundData;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async autoCancelDefaults(): Promise<number> {
    const client = await pool.connect();
    let canceledCount = 0;
    try {
      await client.query('BEGIN');

      const defaultBookings = await getUnpaidBookingsOlderThanTwoMonths(client);

      for (const row of defaultBookings) {
        await updateBookingStatus(client, row.booking_id, 'CANCELED');
        await updatePropertyStatus(client, row.property_id, 'AVAILABLE');
        canceledCount++;
      }

      await client.query('COMMIT');
      return canceledCount;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
