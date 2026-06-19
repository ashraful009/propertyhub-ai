import { Router } from 'express';
import { getAdminDashboardData } from '../../controllers/admin/dashboard.controller';
import { getAllApplications, reviewApplication } from '../../controllers/admin/vendor.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', verifyToken, authorizeRoles('ADMIN'), getAdminDashboardData);
router.get('/vendor-applications', verifyToken, authorizeRoles('ADMIN'), getAllApplications);
router.put('/vendor-applications/:id/status', verifyToken, authorizeRoles('ADMIN'), reviewApplication);

export default router;
