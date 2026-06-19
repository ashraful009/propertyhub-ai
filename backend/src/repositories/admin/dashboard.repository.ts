import pool from '../../config/db';

// ADMIN DASHBOARD 
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
