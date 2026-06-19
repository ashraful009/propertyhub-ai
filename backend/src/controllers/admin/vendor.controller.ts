import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { findAllApplications, updateApplicationAndRole } from '../../repositories/admin/vendor.repository';

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
