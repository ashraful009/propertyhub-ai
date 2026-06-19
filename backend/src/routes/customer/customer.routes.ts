import { Router } from 'express';
import { getCustomerDashboardData } from '../../controllers/customer/dashboard.controller';
import { submitApplication } from '../../controllers/customer/vendor.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', verifyToken, authorizeRoles('CUSTOMER'), getCustomerDashboardData);
router.post('/vendor-apply', verifyToken, authorizeRoles('CUSTOMER'), submitApplication);

export default router;
