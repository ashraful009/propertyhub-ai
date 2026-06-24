import {Router} from 'express';
import {register, login, googleLogin, seedAdminUser} from '../../controllers/shared/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);

// TEMPORARY: Seed Admin Endpoint
router.get('/seed-admin', seedAdminUser);

export default router;