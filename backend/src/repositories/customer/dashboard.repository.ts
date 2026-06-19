import pool from '../../config/db';

// CUSTOMER DASHBOARD 
export const getCustomerStats = async (customerId: string) => {
  const client = await pool.connect();
  try {
    // My Properties
    const propertiesRes = await client.query(`
      SELECT COUNT(*) as total_properties FROM bookings WHERE user_id = $1 AND status != 'CANCELED'
    `, [customerId]);

    // Financial Overview (Total Paid)
    const paidRes = await client.query(`
      SELECT COALESCE(SUM(amount), 0) as total_paid FROM invoices WHERE user_id = $1 AND status = 'PAID'
    `, [customerId]);

    // Total Due Calculation (Total Payable from all plans - Total Paid from installments)
    const dueRes = await client.query(`
      SELECT COALESCE(SUM(total_payable_amount), 0) as total_payable FROM installment_plans ip
      JOIN bookings b ON ip.booking_id = b.id WHERE b.user_id = $1 AND b.status != 'CANCELED'
    `, [customerId]);

    const totalPaid = parseFloat(paidRes.rows[0].total_paid);
    const totalPayable = parseFloat(dueRes.rows[0].total_payable);
    const totalDue = totalPayable > 0 ? (totalPayable - totalPaid) : 0;

    // Upcoming Payments 
    const nextPaymentRes = await client.query(`
      SELECT im.amount, im.due_date, p.title as property_title
      FROM installment_milestones im
      JOIN installment_plans ip ON im.plan_id = ip.id
      JOIN bookings b ON ip.booking_id = b.id
      JOIN properties p ON b.property_id = p.id
      WHERE b.user_id = $1 AND im.status = 'UNPAID'
      ORDER BY im.due_date ASC LIMIT 1
    `, [customerId]);

    // Payment History
    const historyRes = await client.query(`
      SELECT amount, status, created_at, stripe_session_id 
      FROM invoices WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5
    `, [customerId]);

    return {
      myPropertiesCount: propertiesRes.rows[0].total_properties,
      financialOverview: {
        totalPaid: totalPaid,
        totalDue: totalDue > 0 ? totalDue : 0
      },
      upcomingPayment: nextPaymentRes.rows[0] || null,
      paymentHistory: historyRes.rows
    };
  } finally {
    client.release();
  }
};
