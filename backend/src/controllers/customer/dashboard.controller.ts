import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getCustomerStats } from '../../repositories/customer/dashboard.repository';

export const getCustomerDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'CUSTOMER') {
      res.status(403).json({ error: 'Unauthorized or invalid user role' });
      return;
    }

    const data = await getCustomerStats(user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Customer Dashboard Error:', error);
    res.status(500).json({ error: 'Internal Server Error fetching dashboard stats.' });
  }
};
