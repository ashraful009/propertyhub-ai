import pool from '../../database/db';
import { IProperty } from '../../models/shared/property.model';
export const findAllProperties = async (): Promise<IProperty[]> => {
  const query = `
    SELECT * FROM properties 
    WHERE is_approved = true
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const findPropertyById = async (propertyId: string): Promise<IProperty | null> => {
  const query = `
    SELECT p.*, u.name AS vendor_name, u.email AS vendor_email
    FROM properties p
    JOIN users u ON p.vendor_id = u.id
    WHERE p.id = $1 AND p.is_approved = true;
  `;
  const result = await pool.query(query, [propertyId]);
  return result.rows[0] || null;
};

export const getPublicStats = async () => {
  const propertiesQuery = `SELECT COUNT(*) FROM properties WHERE is_approved = true;`;
  const customersQuery = `SELECT COUNT(*) FROM users WHERE role = 'CUSTOMER';`;
  const vendorsQuery = `SELECT COUNT(*) FROM users WHERE role = 'VENDOR';`;
  
  const [propertiesResult, customersResult, vendorsResult] = await Promise.all([
    pool.query(propertiesQuery),
    pool.query(customersQuery),
    pool.query(vendorsQuery)
  ]);

  return {
    totalProperties: parseInt(propertiesResult.rows[0].count),
    happyClients: parseInt(customersResult.rows[0].count),
    verifiedVendors: parseInt(vendorsResult.rows[0].count)
  };
};
