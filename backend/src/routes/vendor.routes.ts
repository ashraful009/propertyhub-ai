import { Router } from 'express';
import { getVendorPolicy, submitApplication, getAllApplications, reviewApplication } from '../controllers/vendor.controller';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Policy route
router.get('/policy', getVendorPolicy);

// Application route
router.post('/apply', verifyToken, authorizeRoles('CUSTOMER'), submitApplication);

// All application fetch route (admin)
router.get('/applications', verifyToken, authorizeRoles('ADMIN'), getAllApplications);

// Application route
router.put('/applications/:id/status', verifyToken, authorizeRoles('ADMIN'), reviewApplication);

export default router;