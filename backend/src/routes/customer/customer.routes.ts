import { Router } from 'express';
import { getCustomerDashboardData } from '../../controllers/customer/dashboard.controller';
import { submitApplication } from '../../controllers/customer/vendor.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';
import { upload } from '../../config/cloudinary';

const router = Router();

router.get('/dashboard', verifyToken, authorizeRoles('CUSTOMER'), getCustomerDashboardData);
router.post('/vendor-apply', verifyToken, authorizeRoles('CUSTOMER'), upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'nidScan', maxCount: 1 },
  { name: 'tradeLicenseFile', maxCount: 1 },
  { name: 'tinFile', maxCount: 1 },
  { name: 'binFile', maxCount: 1 }
]), submitApplication);

export default router;
