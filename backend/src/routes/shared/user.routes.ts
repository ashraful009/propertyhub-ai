import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';
import { getUserProfile, updateUserProfileHandler, getVendorDashboard, getAdminDashboard } from '../../controllers/shared/user.controller';
import { upload } from '../../config/cloudinary';

const router = Router();
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, upload.single('profile_photo'), updateUserProfileHandler);
router.get('/vendor-dashboard', verifyToken, authorizeRoles('VENDOR', 'ADMIN'), getVendorDashboard);
router.get('/admin-only', verifyToken, authorizeRoles('ADMIN'), getAdminDashboard);

export default router;