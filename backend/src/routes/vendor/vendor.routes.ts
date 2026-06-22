import { Router } from 'express';
import { getVendorDashboardData } from '../../controllers/vendor/dashboard.controller';
import { createProperty, updateProperty, deleteProperty, getProperties, getPropertyById } from '../../controllers/vendor/property.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';
import { upload } from '../../config/cloudinary';

const router = Router();

router.get('/dashboard', verifyToken, authorizeRoles('VENDOR'), getVendorDashboardData);

router.get('/properties', verifyToken, authorizeRoles('VENDOR', 'ADMIN'), getProperties);
router.get('/properties/:id', verifyToken, authorizeRoles('VENDOR', 'ADMIN'), getPropertyById);

router.post(
  '/properties', 
  verifyToken, 
  authorizeRoles('VENDOR', 'ADMIN'), 
  upload.array('images', 5), 
  createProperty
);

router.put(
  '/properties/:id', 
  verifyToken, 
  authorizeRoles('VENDOR', 'ADMIN'), 
  upload.array('images', 5),
  updateProperty
);

router.delete(
  '/properties/:id', 
  verifyToken, 
  authorizeRoles('VENDOR', 'ADMIN'), 
  deleteProperty
);

export default router;
