import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken, getDashboardData);

export default router;