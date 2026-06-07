import { Router } from 'express';
import { createProperty, getAllProperties, updateProperty, deleteProperty } from '../controllers/property.controller';
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


// 3. Update Property Route
router.put(
  '/:id', 
  verifyToken, 
  authorizeRoles('VENDOR', 'ADMIN'), 
  upload.array('images', 5),
  updateProperty
);

// ৪. Delete Property Route
router.delete(
  '/:id', 
  verifyToken, 
  authorizeRoles('VENDOR', 'ADMIN'), 
  deleteProperty
);

export default router;