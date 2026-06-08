import { Router } from "express";
import {compareProperties} from '../controllers/compare.controller';

const router = Router();

router.get('/properties', compareProperties);

export default router;
