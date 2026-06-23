import pool from "../../database/db";
import { IInvoice } from "../../models/shared/invoice.model";

export const createInvoice = async (bookingId: string, userId: string, amount: number, sessionId: string, milestoneId: string | null = null): Promise<IInvoice> => {
  const query = `
    INSERT INTO invoices (booking_id, user_id, amount, stripe_session_id, milestone_id, status)
    VALUES ($1, $2, $3, $4, $5, 'PENDING')
    RETURNING *;
  `;
  const result = await pool.query(query, [bookingId, userId, amount, sessionId, milestoneId]);
  return result.rows[0];
};

export const updatePaymentSuccess = async (sessionId: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Mark the invoice as PAID
    const invoiceQuery = `UPDATE invoices SET status = 'PAID', paid_at = CURRENT_TIMESTAMP WHERE stripe_session_id = $1 AND status = 'PENDING' RETURNING *`;
    const invoiceRes = await client.query(invoiceQuery, [sessionId]);
    if (invoiceRes.rowCount === 0) throw new Error("Invoice not found or already paid.");
    const invoice = invoiceRes.rows[0];

    // 2. Mark the correct milestone as PAID
    if (invoice.milestone_id) {
      // If the invoice is tied to a specific milestone, mark that one
      const milestoneQuery = `UPDATE installment_milestones SET status = 'PAID' WHERE id = $1 AND status = 'UNPAID'`;
      await client.query(milestoneQuery, [invoice.milestone_id]);
    } else {
      // Fallback for booking-money invoices without a milestone: mark the earliest unpaid
      const milestoneQuery = `UPDATE installment_milestones SET status = 'PAID' WHERE id = (SELECT id FROM installment_milestones WHERE plan_id = (SELECT id FROM installment_plans WHERE booking_id = $1) AND status = 'UNPAID' ORDER BY due_date ASC LIMIT 1)`;
      await client.query(milestoneQuery, [invoice.booking_id]);
    }

    // 3. Record 5% platform commission
    const commissionRate = 0.05;
    const commissionAmount = parseFloat(invoice.amount) * commissionRate;
    const commissionQuery = `INSERT INTO platform_commissions (booking_id, amount, milestone_id) VALUES ($1, $2, $3)`;
    await client.query(commissionQuery, [invoice.booking_id, commissionAmount, invoice.milestone_id]);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Payment Verification Error:", error);
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
