import pool from '../../database/db';
import { IUser } from '../../models/shared/user.model';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const createUser = async (userData: IUser): Promise<IUser> => {
  const query = `
    INSERT INTO users (name, email, password, role) 
    VALUES($1, $2, $3, $4) 
    RETURNING id, name, email, role
  `;
  const values = [userData.name, userData.email, userData.password, userData.role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findUserById = async (id: string) => {
  const query = `
    SELECT id, name, email, role, profile_photo, phone, address, district, created_at 
    FROM users 
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const updateUserProfile = async (id: string, data: any) => {
  const query = `
    UPDATE users 
    SET name = $1, phone = $2, address = $3, district = $4, profile_photo = COALESCE($5, profile_photo), updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING id, name, email, role, profile_photo, phone, address, district;
  `;
  const values = [data.name, data.phone, data.address, data.district, data.profile_photo, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findVendorApplicationByUserId = async (userId: string) => {
  const query = `
    SELECT * FROM vendor_applications
    WHERE user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

export const updateVendorApplication = async (userId: string, data: any) => {
  const existing = await findVendorApplicationByUserId(userId);
  if (existing) {
    const query = `
      UPDATE vendor_applications
      SET company_name = COALESCE($1, company_name),
          location = COALESCE($2, location),
          full_address = COALESCE($3, full_address),
          company_mail = COALESCE($4, company_mail),
          phone = COALESCE($5, phone),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $6
      RETURNING *;
    `;
    const values = [data.company_name, data.location, data.full_address, data.company_mail, data.phone, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } else {
    // Insert if no application exists yet
    const query = `
      INSERT INTO vendor_applications (user_id, company_name, location, full_address, company_mail, phone, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'APPROVED')
      RETURNING *;
    `;
    const values = [
      userId,
      data.company_name || 'Not Provided',
      data.location || 'Not Provided',
      data.full_address || 'Not Provided',
      data.company_mail || 'Not Provided',
      data.phone || 'Not Provided'
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};
