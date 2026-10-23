import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/task.validator.js';

const router = Router();

// Every task route requires a valid JWT
router.use(protect);

router.route('/').get(getTasks).post(validate(createTaskSchema), createTask);

router
  .route('/:id')
  .all(validateObjectId)
  .get(getTaskById)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;