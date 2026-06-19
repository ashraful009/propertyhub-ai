import pool from '../../config/db';
import { IVendorApplication } from '../../models/vendor/vendor.model';

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
