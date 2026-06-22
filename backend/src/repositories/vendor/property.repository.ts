import pool from '../../database/db';
import { IProperty } from '../../models/shared/property.model';

export const getPropertiesByVendor = async (vendorId: string): Promise<IProperty[]> => {
  const query = `
    SELECT * FROM properties 
    WHERE vendor_id = $1 
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [vendorId]);
  return result.rows;
};

export const getPropertyByIdForVendor = async (propertyId: string, vendorId: string): Promise<IProperty | null> => {
  const query = `
    SELECT * FROM properties 
    WHERE id = $1 AND vendor_id = $2;
  `;
  const result = await pool.query(query, [propertyId, vendorId]);
  return result.rows[0] || null;
};

export const insertProperty = async (propertyData: IProperty): Promise<IProperty> => {
  const query = `
    INSERT INTO properties 
    (title, description, price, location, address, property_type, bedrooms, bathrooms, area, images, vendor_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;
  
  const values = [
    propertyData.title,
    propertyData.description,
    propertyData.price,
    propertyData.location,
    propertyData.address,
    propertyData.property_type,
    propertyData.bedrooms,
    propertyData.bathrooms,
    propertyData.area,
    propertyData.images,
    propertyData.vendor_id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
export const updatePropertyById = async (propertyId: string, userId: string, userRole: string, updateData: any): Promise<IProperty | null> => {
  const fields = [];
  const values = [];
  let paramIndex = 1;
  for (const [key, value] of Object.entries(updateData)) {
    fields.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  }

  if (fields.length === 0) return null;

  values.push(propertyId);
  const queryIdIndex = paramIndex;
  
  let query = `UPDATE properties SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${queryIdIndex}`;
  if (userRole !== 'ADMIN') {
    values.push(userId);
    query += ` AND vendor_id = $${queryIdIndex + 1}`;
  }

  query += ` RETURNING *;`;

  const result = await pool.query(query, values);
  return result.rows[0];
};
export const deletePropertyById = async (propertyId: string, userId: string, userRole: string): Promise<boolean> => {
  let query = `DELETE FROM properties WHERE id = $1`;
  const values = [propertyId];

  if (userRole !== 'ADMIN') {
    query += ` AND vendor_id = $2`;
    values.push(userId);
  }

  const result = await pool.query(query, values);
  return (result.rowCount ?? 0) > 0;
};
