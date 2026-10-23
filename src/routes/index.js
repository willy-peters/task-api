import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes from './task.routes.js';

const router = Router();

// GET /api/v1/health  (public)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes); // protected inside task.routes.js

export default router;