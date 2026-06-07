import pool from '../config/db';
import { IProperty } from '../models/property.model';

// ১. প্রপার্টি সেভ করার কুয়েরি
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

// ২. সব প্রপার্টি ফেচ করার কুয়েরি
export const findAllProperties = async (): Promise<IProperty[]> => {
  const query = `
    SELECT * FROM properties 
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};