import pool from '../../database/db';
import { IBooking } from '../../models/customer/booking.model';

export const insertBooking = async (property_id: string, customer_id: string, vendor_id: string, booking_amount: number, applicant_info?: string, nominee_info?: string): Promise<IBooking> => {
  const query = `
    INSERT INTO bookings (property_id, customer_id, vendor_id, booking_amount, applicant_info, nominee_info, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
    RETURNING *;
  `;
  const result = await pool.query(query, [property_id, customer_id, vendor_id, booking_amount, applicant_info || null, nominee_info || null]);
  return result.rows[0];
};

export const findBookingByUser = async (customerId: string): Promise<IBooking[]> => {
  const query = `
    SELECT * FROM bookings WHERE customer_id = $1 ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [customerId]);
  return result.rows;
};

export const updateBookingStatusInDb = async (bookingId: string, status: string): Promise<IBooking> => {
  const query = `
    UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;
  `;
  const result = await pool.query(query, [status, bookingId]);
  return result.rows[0];
};

export const getBookingByIdAndUser = async (client: any, bookingId: string, userId: string) => {
  const query = `SELECT * FROM bookings WHERE id = $1 AND customer_id = $2`;
  const res = await client.query(query, [bookingId, userId]);
  return res.rows[0];
};

export const updateBookingStatus = async (client: any, bookingId: string, status: string) => {
  await client.query(`UPDATE bookings SET status = $1 WHERE id = $2`, [status, bookingId]);
};

export const updatePropertyStatus = async (client: any, propertyId: string, status: string) => {
  await client.query(`UPDATE properties SET status = $1 WHERE id = $2`, [status, propertyId]);
};
