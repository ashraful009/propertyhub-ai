import pool from '../../config/db';

// ১. Customer Cancellation within one month
export const processCustomerCancellation = async (bookingId: string, userId: string): Promise<any> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const bookingQuery = `SELECT * FROM bookings WHERE id = $1 AND user_id = $2 AND status = 'CONFIRMED'`;
    const bookingRes = await client.query(bookingQuery, [bookingId, userId]);
    
    if (bookingRes.rows.length === 0) throw new Error("Booking not found or already canceled.");
    const booking = bookingRes.rows[0];

    const bookingDate = new Date(booking.created_at);
    const currentDate = new Date();
    const differenceInDays = (currentDate.getTime() - bookingDate.getTime()) / (1000 * 3600 * 24);

    if (differenceInDays > 30) {
      throw new Error("Cancellation not acceptable. It has been more than 1 month since booking.");
    }

    // Booking Money + Paid Installments
    const paidQuery = `SELECT COALESCE(SUM(amount), 0) as total_paid FROM invoices WHERE booking_id = $1 AND status = 'PAID'`;
    const paidRes = await client.query(paidQuery, [bookingId]);
    const totalPaid = parseFloat(paidRes.rows[0].total_paid);

    if (totalPaid === 0) throw new Error("No payment found to refund.");

    // 10% refund charge calculate
    const penaltyAmount = totalPaid * 0.10;
    const refundAmount = totalPaid - penaltyAmount;

    // Refund table data insert
    const refundQuery = `
      INSERT INTO refunds (booking_id, total_paid, penalty_amount, refund_amount)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const refundData = await client.query(refundQuery, [bookingId, totalPaid, penaltyAmount, refundAmount]);

    // After cancilation make unit avilable
    await client.query(`UPDATE bookings SET status = 'CANCELED' WHERE id = $1`, [bookingId]);
    await client.query(`UPDATE properties SET status = 'AVAILABLE' WHERE id = $1`, [booking.property_id]);

    await client.query('COMMIT');
    return refundData.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// ২. Auto-Cancellation after 2 month
export const processAutoCancellationForDefaults = async (): Promise<number> => {
  const client = await pool.connect();
  let canceledCount = 0;
  try {
    await client.query('BEGIN');

    // find booking unit, which are not paid within 2 month
    const defaultBookingsQuery = `
      SELECT p.booking_id, b.property_id
      FROM installment_milestones m
      JOIN installment_plans p ON m.plan_id = p.id
      JOIN bookings b ON p.booking_id = b.id
      WHERE m.status = 'UNPAID' AND m.due_date < CURRENT_DATE AND b.status = 'CONFIRMED'
      GROUP BY p.booking_id, b.property_id
      HAVING COUNT(m.id) >= 2;
    `;
    const defaultBookings = await client.query(defaultBookingsQuery);

    for (const row of defaultBookings.rows) {
      // cancle booking
      await client.query(`UPDATE bookings SET status = 'CANCELED' WHERE id = $1`, [row.booking_id]);
      // property Available
      await client.query(`UPDATE properties SET status = 'AVAILABLE' WHERE id = $1`, [row.property_id]);
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
};