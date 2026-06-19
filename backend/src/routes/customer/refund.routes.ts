import { Router } from 'express';
import { requestCancellation, triggerAutoCancellation } from '../../controllers/customer/refund.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// cancel route for customer
router.post('/cancel', verifyToken, authorizeRoles('CUSTOMER'), requestCancellation);

// corn job cancilation
router.post('/trigger-defaults', verifyToken, authorizeRoles('ADMIN'), triggerAutoCancellation);

export default router;