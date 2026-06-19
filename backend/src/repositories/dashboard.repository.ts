import pool from '../config/db';

//ADMIN DASHBOARD 
export const getAdminStats = async () => {
  const client = await pool.connect();
  try {
    // Total Revenue
    const revenueRes = await client.query(`SELECT COALESCE(SUM(amount), 0) as total_revenue FROM platform_commissions`);
    
    // Revenue Breakdown by Company 
    const companyRevenueRes = await client.query(`
      SELECT va.company_name, COALESCE(SUM(pc.amount), 0) as revenue
      FROM platform_commissions pc
      JOIN bookings b ON pc.booking_id = b.id
      JOIN properties p ON b.property_id = p.id
      JOIN vendor_applications va ON p.vendor_id = va.user_id
      GROUP BY va.company_name
      ORDER BY revenue DESC
    `);

    // User Statistics
    const usersRes = await client.query(`
      SELECT role, COUNT(*) as count FROM users 
      WHERE role IN ('CUSTOMER', 'VENDOR') GROUP BY role
    `);

    // Property Status
    const propertiesRes = await client.query(`
      SELECT status, COUNT(*) as count FROM properties GROUP BY status
    `);

    // Pending Vendor Actions
    const pendingVendorsRes = await client.query(`
      SELECT COUNT(*) as count FROM vendor_applications WHERE status = 'PENDING'
    `);

    return {
      totalRevenue: revenueRes.rows[0].total_revenue,
      revenueByCompany: companyRevenueRes.rows,
      userStatistics: usersRes.rows,
      propertyStatus: propertiesRes.rows,
      pendingVendorApplications: pendingVendorsRes.rows[0].count
    };
  } finally {
    client.release();
  }
};

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