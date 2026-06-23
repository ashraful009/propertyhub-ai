import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { ApiResponse } from '../../responses/ApiResponse';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

import { findUserById, updateUserProfile, findVendorApplicationByUserId, updateVendorApplication } from '../../repositories/shared/user.repository';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return ApiResponse.error(res, 'User not authenticated', 401);
    }
    const user = await findUserById(userId);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    let profileData = { ...user };

    if (user.role === 'VENDOR') {
      const vendorData = await findVendorApplicationByUserId(userId);
      if (vendorData) {
        profileData = { ...profileData, vendor: vendorData };
      }
    }

    ApiResponse.success(res, RESPONSE_MESSAGES.USER.PROFILE_FETCHED, profileData);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching profile', 500);
  }
};

export const updateUserProfileHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return ApiResponse.error(res, 'User not authenticated', 401);
    }

    const { name, phone, address, district, company_name, location, full_address, company_mail, vendor_phone } = req.body;
    let profile_photo = undefined;

    if (req.file) {
      profile_photo = req.file.path;
    }

    let updatedUser = await updateUserProfile(userId, { name, phone, address, district, profile_photo });

    if (req.user?.role === 'VENDOR') {
      const updatedVendor = await updateVendorApplication(userId, {
        company_name,
        location,
        full_address,
        company_mail,
        phone: vendor_phone // vendor specific phone if provided
      });
      updatedUser = { ...updatedUser, vendor: updatedVendor };
    }

    ApiResponse.success(res, 'Profile updated successfully', updatedUser);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating profile', 500);
  }
};

export const getVendorDashboard = (req: AuthRequest, res: Response) => {
  ApiResponse.success(res, RESPONSE_MESSAGES.USER.VENDOR_DASHBOARD, req.user);
};

export const getAdminDashboard = (req: AuthRequest, res: Response) => {
  ApiResponse.success(res, RESPONSE_MESSAGES.USER.ADMIN_DASHBOARD, req.user);
};
