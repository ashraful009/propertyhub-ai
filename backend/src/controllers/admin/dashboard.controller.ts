import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getAdminStats } from '../../repositories/admin/dashboard.repository';

export const getAdminDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Unauthorized or invalid user role' });
      return;
    }

    const data = await getAdminStats();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({ error: 'Internal Server Error fetching dashboard stats.' });
  }
};
