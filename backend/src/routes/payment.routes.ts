import { Router } from 'express';
import { createCheckoutSession, verifyPayment } from '../controllers/payment.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// payment session 
router.post('/create-session', verifyToken, createCheckoutSession);

// verify payment
router.post('/verify', verifyToken, verifyPayment);

export default router;