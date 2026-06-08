import pool from '../config/db';
import { IProperty } from '../models/property.model'; 

export const findPropertiesByFilter = async (filters: any): Promise<IProperty[]> => {
  let query = `SELECT * FROM properties WHERE 1=1`;
  const values: any[] = [];
  let paramIndex = 1;

  if (filters.location) {
    query += ` AND location ILIKE $${paramIndex}`;
    values.push(`%${filters.location}%`);
    paramIndex++;
  }

  if (filters.minPrice) {
    query += ` AND price >= $${paramIndex}`;
    values.push(filters.minPrice);
    paramIndex++;
  }

  if (filters.maxPrice) {
    query += ` AND price <= $${paramIndex}`;
    values.push(filters.maxPrice);
    paramIndex++;
  }

  if (filters.property_type) {
    query += ` AND property_type = $${paramIndex}`;
    values.push(filters.property_type);
    paramIndex++;
  }

  if (filters.bedrooms) {
    query += ` AND bedrooms = $${paramIndex}`;
    values.push(filters.bedrooms);
    paramIndex++;
  }

  if (filters.status) {
    query += ` AND status = $${paramIndex}`;
    values.push(filters.status);
    paramIndex++;
  }

  query += ` ORDER BY created_at DESC;`;

  const result = await pool.query(query, values);
  return result.rows;
};