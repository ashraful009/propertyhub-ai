import { Router } from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../../controllers/customer/booking.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// booking list view (admin, vendor and customer can see own data)
router.get('/', verifyToken, getBookings);

// create booking request (customer only)
router.post('/', verifyToken, authorizeRoles('CUSTOMER'), createBooking);

// booking approve/reject (vendor and admin only)
router.put('/:id/status', verifyToken, authorizeRoles('VENDOR', 'ADMIN'), updateBookingStatus);

export default router;