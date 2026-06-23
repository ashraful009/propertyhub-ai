import { Router } from 'express';
import { getProfile, updateProfile } from '../../controllers/shared/profile.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';
import { uploadProfile } from '../../config/cloudinary';

const router = Router();

// Only Customer and Vendor can manage their profiles
router.use(verifyToken, authorizeRoles('CUSTOMER', 'VENDOR'));

router.get('/', getProfile);
router.put('/', uploadProfile.single('profile_photo'), updateProfile);

export default router;
