import { Router } from 'express';
import { getAllProperties, getPropertyById, getPropertyStats } from '../../controllers/shared/property.controller';

const router = Router();

router.get('/', getAllProperties);
router.get('/stats', getPropertyStats);
router.get('/:id', getPropertyById);

export default router;
