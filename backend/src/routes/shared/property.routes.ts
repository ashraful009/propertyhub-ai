import { Router } from 'express';
import { getAllProperties } from '../../controllers/shared/property.controller';

const router = Router();

router.get('/', getAllProperties);

export default router;
