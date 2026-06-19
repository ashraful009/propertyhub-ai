import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getVendorStats } from '../../repositories/vendor/dashboard.repository';

export const getVendorDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'VENDOR') {
      res.status(403).json({ error: 'Unauthorized or invalid user role' });
      return;
    }

    const data = await getVendorStats(user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Vendor Dashboard Error:', error);
    res.status(500).json({ error: 'Internal Server Error fetching dashboard stats.' });
  }
};
