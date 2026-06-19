import { Router } from 'express';
import { searchProperties } from '../../controllers/shared/search.controller';

const router = Router();

router.get('/properties', searchProperties);

export default router;