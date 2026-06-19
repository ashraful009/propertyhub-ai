import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getAdminStats, getVendorStats, getCustomerStats } from '../repositories/dashboard.repository';

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let data;

    if (user.role === 'ADMIN') {
      data = await getAdminStats();
    } else if (user.role === 'VENDOR') {
      data = await getVendorStats(user.id);
    } else if (user.role === 'CUSTOMER') {
      data = await getCustomerStats(user.id);
    } else {
      res.status(403).json({ error: 'Invalid user role' });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ error: 'Internal Server Error fetching dashboard stats.' });
  }
};