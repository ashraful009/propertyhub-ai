import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware';
import { getUserProfile, getVendorDashboard, getAdminDashboard } from '../controllers/user.controller';

const router = Router();

// Get user profile
router.get('/profile', verifyToken, getUserProfile);

// for admin and vendor only
router.get('/vendor-dashboard', verifyToken, authorizeRoles('VENDOR', 'ADMIN'), getVendorDashboard);

// For Admin only
router.get('/admin-only', verifyToken, authorizeRoles('ADMIN'), getAdminDashboard);

export default router;