import { Router } from 'express';
import { createCheckoutSession, verifyPayment } from '../../controllers/customer/payment.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = Router();
router.post('/create-session', verifyToken, createCheckoutSession);
router.post('/verify', verifyToken, verifyPayment);

export default router;