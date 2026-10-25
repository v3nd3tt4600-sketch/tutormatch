import express from 'express';
import { recommendServices } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/recommend', protect, aiLimiter, recommendServices);

export default router;
