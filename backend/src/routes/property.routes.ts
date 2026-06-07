import { Router } from 'express';
import { createProperty, getAllProperties } from '../controllers/property.controller';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware';
import { upload } from '../config/cloudinary';

const router = Router();

// পাবলিক রাউট: কাস্টমার বা যে কেউ লগইন ছাড়াই প্রপার্টি লিস্ট দেখতে পারবে
router.get('/', getAllProperties);

// সিকিউরড রাউট: শুধু ভেন্ডর বা অ্যাডমিন প্রপার্টি অ্যাড করতে পারবে
router.post(
  '/', 
  verifyToken, 
  authorizeRoles('VENDOR', 'ADMIN'), 
  upload.array('images', 5), 
  createProperty
);

export default router;