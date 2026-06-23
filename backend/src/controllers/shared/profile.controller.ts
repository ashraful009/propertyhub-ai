import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import pool from '../../database/db';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.UNAUTHORIZED, 401);
    }

    const query = `
      SELECT u.id, u.name, u.email, u.role, u.profile_photo, u.phone, u.address, u.district, u.created_at, u.updated_at,
             v.company_name, v.company_mail, v.location, v.full_address, v.document_url, v.status as vendor_status
      FROM users u
      LEFT JOIN vendor_applications v ON u.id = v.user_id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [userId]);
    
    if (result.rowCount === 0) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    return ApiResponse.success(res, 'Profile fetched successfully', result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.id;
    if (!userId) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.UNAUTHORIZED, 401);
    }

    const { name, phone, address, district, company_name, company_mail, location, full_address, vendor_phone } = req.body;
    let profilePhotoUrl = undefined;

    if (req.file) {
      profilePhotoUrl = req.file.path; // Cloudinary secure URL
    }

    await client.query('BEGIN');

    // Build dynamic query for Users
    let userQuery = `UPDATE users SET updated_at = CURRENT_TIMESTAMP`;
    const userParams: any[] = [];
    let userParamIndex = 1;

    if (name) { userQuery += `, name = $${userParamIndex++}`; userParams.push(name); }
    if (phone !== undefined) { userQuery += `, phone = $${userParamIndex++}`; userParams.push(phone); }
    if (address !== undefined) { userQuery += `, address = $${userParamIndex++}`; userParams.push(address); }
    if (district !== undefined) { userQuery += `, district = $${userParamIndex++}`; userParams.push(district); }
    if (profilePhotoUrl) { userQuery += `, profile_photo = $${userParamIndex++}`; userParams.push(profilePhotoUrl); }

    userQuery += ` WHERE id = $${userParamIndex} RETURNING *`;
    userParams.push(userId);

    const userResult = await client.query(userQuery, userParams);

    if (userResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return ApiResponse.error(res, 'User not found', 404);
    }

    // Build dynamic query for Vendor Applications if user is a vendor
    if (req.user?.role === 'VENDOR') {
      let vendorQuery = `UPDATE vendor_applications SET updated_at = CURRENT_TIMESTAMP`;
      const vendorParams: any[] = [];
      let vendorParamIndex = 1;

      if (company_name !== undefined) { vendorQuery += `, company_name = $${vendorParamIndex++}`; vendorParams.push(company_name); }
      if (company_mail !== undefined) { vendorQuery += `, company_mail = $${vendorParamIndex++}`; vendorParams.push(company_mail); }
      if (location !== undefined) { vendorQuery += `, location = $${vendorParamIndex++}`; vendorParams.push(location); }
      if (full_address !== undefined) { vendorQuery += `, full_address = $${vendorParamIndex++}`; vendorParams.push(full_address); }
      if (vendor_phone !== undefined) { vendorQuery += `, phone = $${vendorParamIndex++}`; vendorParams.push(vendor_phone); }

      vendorQuery += ` WHERE user_id = $${vendorParamIndex}`;
      vendorParams.push(userId);

      // Only run update if there are fields to update
      if (vendorParams.length > 1) {
        await client.query(vendorQuery, vendorParams);
      }
    }

    await client.query('COMMIT');

    // Fetch the combined updated profile
    const finalQuery = `
      SELECT u.id, u.name, u.email, u.role, u.profile_photo, u.phone, u.address, u.district, u.created_at, u.updated_at,
             v.company_name, v.company_mail, v.location, v.full_address, v.document_url, v.status as vendor_status
      FROM users u
      LEFT JOIN vendor_applications v ON u.id = v.user_id
      WHERE u.id = $1
    `;
    const finalResult = await client.query(finalQuery, [userId]);

    return ApiResponse.success(res, 'Profile updated successfully', finalResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating profile:', error);
    return ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  } finally {
    client.release();
  }
};
