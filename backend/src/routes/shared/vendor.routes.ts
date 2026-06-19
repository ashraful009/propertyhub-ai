import { Router } from 'express';
import { getVendorPolicy } from '../../controllers/shared/vendor.controller';

const router = Router();

router.get('/policy', getVendorPolicy);

export default router;
