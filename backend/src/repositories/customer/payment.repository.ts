import pool from "../../database/db";
import { IInvoice } from "../../models/shared/invoice.model";

export const createInvoice = async (bookingId: string, userId: string, amount: number, sessionId: string): Promise<IInvoice> => {
  const query = `
    INSERT INTO invoices (booking_id, user_id, amount, stripe_session_id, status)
    VALUES ($1, $2, $3, $4, 'PENDING')
    RETURNING *;
  `;
  const result = await pool.query(query, [bookingId, userId, amount, sessionId]);
  return result.rows[0];
};

export const updatePaymentSuccess = async (sessionId: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const invoiceQuery = `UPDATE invoices SET status = 'PAID', updated_at = CURRENT_TIMESTAMP WHERE stripe_session_id = $1 RETURNING *`;
    const invoiceRes = await client.query(invoiceQuery, [sessionId]);
    if (invoiceRes.rowCount === 0) throw new Error("Invoice not found.");
    const invoice = invoiceRes.rows[0];

    const milestoneQuery = `UPDATE installment_milestones SET status = 'PAID' WHERE id = (SELECT id FROM installment_milestones WHERE plan_id = (SELECT id FROM installment_plans WHERE booking_id = $1) AND status = 'UNPAID' ORDER BY due_date ASC LIMIT 1)`;
    await client.query(milestoneQuery, [invoice.booking_id]);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Webhook Update Error:", error);
    return false;
  } finally {
    client.release();
  }
};

export const getTotalPaidForBooking = async (client: any, bookingId: string): Promise<number> => {
  const query = `SELECT COALESCE(SUM(amount), 0) as total_paid FROM invoices WHERE booking_id = $1 AND status = 'PAID'`;
  const res = await client.query(query, [bookingId]);
  return parseFloat(res.rows[0].total_paid);
};
