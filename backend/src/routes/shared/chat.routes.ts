import { Router } from 'express';
import { chat } from '../../controllers/shared/chat.controller';

const router = Router();

// No auth middleware — guest users can chat
router.post('/', chat);

export default router;
