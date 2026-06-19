import pool from '../../database/db';

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

export const updateApplicationStatus = async (client: any, applicationId: string, status: string) => {
  const appQuery = `UPDATE vendor_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`;
  await client.query(appQuery, [status, applicationId]);
};

export const updateUserRole = async (client: any, userId: string, role: string) => {
  const userQuery = `UPDATE users SET role = $1 WHERE id = $2`;
  await client.query(userQuery, [role, userId]);
};
