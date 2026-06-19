import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { insertVendorApplication } from '../../repositories/customer/vendor.repository';

// ২. Submit Application 
export const submitApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId || req.user?.role !== 'CUSTOMER') {
      res.status(403).json({ error: 'Only customers can apply to become a vendor.' });
      return;
    }

    const { company_name, location, full_address, company_mail, phone, document_url } = req.body;

    const applicationData = {
      user_id: userId,
      company_name,
      location,
      full_address,
      company_mail,
      phone,
      document_url
    };

    const newApplication = await insertVendorApplication(applicationData);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Waiting for admin approval.',
      data: newApplication,
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
