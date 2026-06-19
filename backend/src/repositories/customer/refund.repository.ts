import pool from '../../database/db';

export const insertRefund = async (client: any, bookingId: string, totalPaid: number, penaltyAmount: number, refundAmount: number) => {
  const refundQuery = `
    INSERT INTO refunds (booking_id, total_paid, penalty_amount, refund_amount)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const result = await client.query(refundQuery, [bookingId, totalPaid, penaltyAmount, refundAmount]);
  return result.rows[0];
};

export const getUnpaidBookingsOlderThanTwoMonths = async (client: any): Promise<any[]> => {
  const defaultBookingsQuery = `
    SELECT p.booking_id, b.property_id
    FROM installment_milestones m
    JOIN installment_plans p ON m.plan_id = p.id
    JOIN bookings b ON p.booking_id = b.id
    WHERE m.status = 'UNPAID' AND m.due_date < CURRENT_DATE AND b.status = 'CONFIRMED'
    GROUP BY p.booking_id, b.property_id
    HAVING COUNT(m.id) >= 2;
  `;
  const result = await client.query(defaultBookingsQuery);
  return result.rows;
};
