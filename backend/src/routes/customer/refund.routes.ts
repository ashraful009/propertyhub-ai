import { Router } from 'express';
import { requestCancellation, triggerAutoCancellation } from '../../controllers/customer/refund.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();
router.post('/cancel', verifyToken, authorizeRoles('CUSTOMER'), requestCancellation);
router.post('/trigger-defaults', verifyToken, authorizeRoles('ADMIN'), triggerAutoCancellation);

export default router;