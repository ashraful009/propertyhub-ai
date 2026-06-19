import { Router } from 'express';
import { previewInstallment, generateInstallments, getInstallmentSchedule } from '../../controllers/customer/installment.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// ১. Preview Calculation 
router.post('/preview', previewInstallment);

// ২. Generate Plan (Customer)
router.post('/generate', verifyToken, authorizeRoles('CUSTOMER'), generateInstallments);

// ৩. Get Full Schedule (Customer, Vendor, Admin )
router.get('/schedule/:booking_id', verifyToken, getInstallmentSchedule);

export default router;