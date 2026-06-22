import { Router } from 'express';
import { getAdminDashboardData } from '../../controllers/admin/dashboard.controller';
import { getAllApplications, reviewApplication } from '../../controllers/admin/vendor.controller';
import { getPendingPropertyRequests, reviewPropertyRequest } from '../../controllers/admin/property.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', verifyToken, authorizeRoles('ADMIN'), getAdminDashboardData);
router.get('/vendor-applications', verifyToken, authorizeRoles('ADMIN'), getAllApplications);
router.put('/vendor-applications/:id/status', verifyToken, authorizeRoles('ADMIN'), reviewApplication);

router.get('/property-requests', verifyToken, authorizeRoles('ADMIN'), getPendingPropertyRequests);
router.put('/property-requests/:id/review', verifyToken, authorizeRoles('ADMIN'), reviewPropertyRequest);

export default router;
