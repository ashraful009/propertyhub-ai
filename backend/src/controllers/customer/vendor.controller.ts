import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { insertVendorApplication } from '../../repositories/customer/vendor.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId || req.user?.role !== 'CUSTOMER') {
      return ApiResponse.error(res, ERROR_MESSAGES.VENDOR.CUSTOMER_ONLY_APPLY, 403);
    }

    const { company_name, location, full_address, company_mail, phone, full_name, nid_number, trade_license, tin_number, bin_number } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const documents: any = {};

    // Store identity & compliance text fields
    if (full_name) documents.fullName = full_name;
    if (nid_number) documents.nidNumber = nid_number;
    if (trade_license) documents.tradeLicense = trade_license;
    if (tin_number) documents.tinNumber = tin_number;
    if (bin_number) documents.binNumber = bin_number;

    // Store uploaded file paths
    if (files) {
      if (files.profileImage) documents.profileImage = files.profileImage[0].path;
      if (files.nidScan) documents.nidScan = files.nidScan[0].path;
      if (files.tradeLicenseFile) documents.tradeLicenseFile = files.tradeLicenseFile[0].path;
      if (files.tinFile) documents.tinFile = files.tinFile[0].path;
      if (files.binFile) documents.binFile = files.binFile[0].path;
    }

    const applicationData = {
      user_id: userId,
      company_name,
      location,
      full_address,
      company_mail,
      phone,
      document_url: JSON.stringify(documents),
    };

    const newApplication = await insertVendorApplication(applicationData);
    ApiResponse.success(res, RESPONSE_MESSAGES.VENDOR.APPLICATION_SUBMITTED, newApplication, 201);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};
