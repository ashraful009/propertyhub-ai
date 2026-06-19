import pool from '../../config/db';

// ৩. Admin will see all vendor application 
export const findAllApplications = async (): Promise<any[]> => {
  const query = `
    SELECT va.*, u.name as applicant_name, u.email as applicant_email 
    FROM vendor_applications va
    JOIN users u ON va.user_id = u.id
    ORDER BY va.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// ৪. Application approve/reject 
export const updateApplicationAndRole = async (applicationId: string, status: string, userId: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Transaction Shuru

    // Application status update
    const appQuery = `UPDATE vendor_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`;
    await client.query(appQuery, [status, applicationId]);

    // jodi APPROVED hoi, tobe users table-e role change hoye VENDOR hobe
    if (status === 'APPROVED') {
      const userQuery = `UPDATE users SET role = 'VENDOR' WHERE id = $1`;
      await client.query(userQuery, [userId]);
    }

    await client.query('COMMIT'); // Shob thik thakle save hobe
    return true;
  } catch (error) {
    await client.query('ROLLBACK'); // Error hole ageer moto hoye jabe
    console.error("Transaction Error in vendor application:", error);
    return false;
  } finally {
    client.release();
  }
};
