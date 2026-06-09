import { Response, Request } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { 
  insertVendorApplication, 
  getVendorPolicyFromDb, 
  findAllApplications, 
  updateApplicationAndRole 
} from '../repositories/vendor.repository';

// ১. Get Policy 
export const getVendorPolicy = async (req: Request, res: Response): Promise<void> => {
  try {
    const policy = await getVendorPolicyFromDb();
    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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

// ৩. Get All Applications (Admin)
export const getAllApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await findAllApplications();
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ৪. Review Application (Admin Approve/Reject)
export const reviewApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Application ID
    const { status, user_id } = req.body; // status: 'APPROVED' or 'REJECTED', and the applicant's user_id

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be APPROVED or REJECTED.' });
      return;
    }

    const success = await updateApplicationAndRole(id as string, status, user_id);

    if (!success) {
      res.status(500).json({ error: 'Failed to update application status.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully. ${status === 'APPROVED' ? 'User is now a VENDOR.' : ''}`,
    });
  } catch (error) {
    console.error('Error reviewing application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};