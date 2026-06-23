import { Router } from 'express';
import { createCheckoutSession, verifyPayment, generateReceipt } from '../../controllers/customer/payment.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = Router();
router.post('/create-session', verifyToken, createCheckoutSession);
router.post('/verify', verifyToken, verifyPayment);
router.get('/receipt/:milestone_id', verifyToken, generateReceipt);

export default router;