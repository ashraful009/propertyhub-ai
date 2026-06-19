import pool from '../../config/db';

// VENDOR DASHBOARD
export const getVendorStats = async (vendorId: string) => {
  const client = await pool.connect();
  try {
    // Cancellations, Refunds & Penalty Revenue
    const refundsRes = await client.query(`
      SELECT COUNT(r.id) as canceled_count, 
             COALESCE(SUM(r.refund_amount), 0) as total_refunded, 
             COALESCE(SUM(r.penalty_amount), 0) as penalty_revenue
      FROM refunds r
      JOIN bookings b ON r.booking_id = b.id
      JOIN properties p ON b.property_id = p.id
      WHERE p.vendor_id = $1
    `, [vendorId]);

    // Total Sales (Confirmed bookings)
    const salesRes = await client.query(`
      SELECT COALESCE(SUM(p.price), 0) as total_sales
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE p.vendor_id = $1 AND b.status IN ('CONFIRMED', 'COMPLETED')
    `, [vendorId]);

    // Property Insights
    const propertiesRes = await client.query(`
      SELECT status, COUNT(*) as count FROM properties 
      WHERE vendor_id = $1 GROUP BY status
    `, [vendorId]);

    // Upcoming Dues 
    const upcomingDuesRes = await client.query(`
      SELECT COALESCE(SUM(im.amount), 0) as total_upcoming_due
      FROM installment_milestones im
      JOIN installment_plans ip ON im.plan_id = ip.id
      JOIN bookings b ON ip.booking_id = b.id
      JOIN properties p ON b.property_id = p.id
      WHERE p.vendor_id = $1 AND im.status = 'UNPAID' 
      AND im.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 month'
    `, [vendorId]);

    // last month due payment
    const defaultersRes = await client.query(`
      SELECT u.name as customer_name, u.email, u.phone, p.title as property, im.amount, im.due_date
      FROM installment_milestones im
      JOIN installment_plans ip ON im.plan_id = ip.id
      JOIN bookings b ON ip.booking_id = b.id
      JOIN users u ON b.user_id = u.id
      JOIN properties p ON b.property_id = p.id
      WHERE p.vendor_id = $1 AND im.status = 'UNPAID' 
      AND im.due_date BETWEEN CURRENT_DATE - INTERVAL '1 month' AND CURRENT_DATE - INTERVAL '1 day'
    `, [vendorId]);

    // Recent Bookings
    const recentBookingsRes = await client.query(`
      SELECT b.id, u.name as customer_name, p.title as property, b.created_at
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN properties p ON b.property_id = p.id
      WHERE p.vendor_id = $1
      ORDER BY b.created_at DESC LIMIT 5
    `, [vendorId]);

    return {
      refundStats: refundsRes.rows[0],
      totalSales: salesRes.rows[0].total_sales,
      propertyInsights: propertiesRes.rows,
      upcomingDuesNextMonth: upcomingDuesRes.rows[0].total_upcoming_due,
      defaultersLastMonth: defaultersRes.rows,
      recentBookings: recentBookingsRes.rows
    };
  } finally {
    client.release();
  }
};
