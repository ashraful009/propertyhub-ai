import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';
import { getUserProfile, getVendorDashboard, getAdminDashboard } from '../../controllers/shared/user.controller';

const router = Router();
router.get('/profile', verifyToken, getUserProfile);
router.get('/vendor-dashboard', verifyToken, authorizeRoles('VENDOR', 'ADMIN'), getVendorDashboard);
router.get('/admin-only', verifyToken, authorizeRoles('ADMIN'), getAdminDashboard);

export default router;