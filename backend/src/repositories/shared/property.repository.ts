import pool from '../../config/db';
import { IProperty } from '../../models/shared/property.model';

// Property read query
export const findAllProperties = async (): Promise<IProperty[]> => {
  const query = `
    SELECT * FROM properties 
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};
