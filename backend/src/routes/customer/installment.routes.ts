import { Router } from 'express';
import { previewInstallment, generateInstallments, getInstallmentSchedule } from '../../controllers/customer/installment.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();
router.post('/preview', previewInstallment);
router.post('/generate', verifyToken, authorizeRoles('CUSTOMER'), generateInstallments);
router.get('/schedule/:booking_id', verifyToken, getInstallmentSchedule);

export default router;