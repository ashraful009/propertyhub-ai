import { Router } from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../../controllers/customer/booking.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();
router.get('/', verifyToken, getBookings);
router.post('/', verifyToken, authorizeRoles('CUSTOMER'), createBooking);
router.put('/:id/status', verifyToken, authorizeRoles('VENDOR', 'ADMIN'), updateBookingStatus);

export default router;