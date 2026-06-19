import pool from "../../config/db";
import { IInvoice } from "../../models/shared/invoice.model";

// Invoice saving
export const createInvoice = async (
  invoiceData: IInvoice,
): Promise<IInvoice> => {
  const query = `
    INSERT INTO invoices (user_id, booking_id, milestone_id, stripe_session_id, amount)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [
    invoiceData.user_id,
    invoiceData.booking_id,
    invoiceData.milestone_id || null,
    invoiceData.stripe_session_id,
    invoiceData.amount,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Paymnent status update
export const updatePaymentSuccess = async (
  sessionId: string,
): Promise<boolean> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Invoice update
    const invoiceQuery = `
      UPDATE invoices 
      SET status = 'PAID', paid_at = CURRENT_TIMESTAMP 
      WHERE stripe_session_id = $1 RETURNING *
    `;
    const invoiceResult = await client.query(invoiceQuery, [sessionId]);
    const invoice = invoiceResult.rows[0];

    if (!invoice) throw new Error("Invoice not found");

    if (invoice.milestone_id) {
      await client.query(
        `UPDATE installment_milestones SET status = 'PAID', paid_at = CURRENT_TIMESTAMP, stripe_charge_id = $1 WHERE id = $2`,
        [sessionId, invoice.milestone_id],
      );
      const commissionAmount = invoice.amount * 0.03; 
      const commissionQuery = `
      INSERT INTO platform_commissions (booking_id, milestone_id, amount) 
      VALUES ($1, $2, $3)
    `;
      await client.query(commissionQuery, [
        invoice.booking_id,
        invoice.milestone_id,
        commissionAmount,
      ]);
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating payment success:", error);
    return false;
  } finally {
    client.release();
  }
};
