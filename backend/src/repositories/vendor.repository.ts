import pool from '../config/db';
import { IVendorApplication } from '../models/vendor.model';

// ১. Vendor application submit 
export const insertVendorApplication = async (data: IVendorApplication): Promise<IVendorApplication> => {
  const query = `
    INSERT INTO vendor_applications (user_id, company_name, location, full_address, company_mail, phone, document_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [data.user_id, data.company_name, data.location, data.full_address, data.company_mail, data.phone, data.document_url];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// ২. System policy fetch 
export const getVendorPolicyFromDb = async (): Promise<string> => {
  const query = `SELECT content FROM system_policies WHERE policy_type = 'VENDOR_POLICY'`;
  const result = await pool.query(query);
  return result.rows[0]?.content || "No policy defined yet.";
};

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