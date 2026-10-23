import Task, { TASK_STATUSES } from '../models/Task.js';
import ApiError from '../utils/ApiError.js';

const ALLOWED_FIELDS = ['title', 'description', 'status'];

const pickAllowedFields = (body = {}) =>
  Object.fromEntries(
    Object.entries(body).filter(
      ([key, value]) => ALLOWED_FIELDS.includes(key) && value !== undefined
    )
  );

// POST /api/v1/tasks
export const createTask = async (req, res) => {
  const task = await Task.create({
    ...pickAllowedFields(req.body),
    user: req.user._id, // owner comes from the token, never from the request body
  });
  res.status(201).json({ success: true, data: task });
};

// GET /api/v1/tasks?status=pending
export const getTasks = async (req, res) => {
  const filter = { user: req.user._id };
  const { status } = req.query;

  if (status !== undefined) {
    if (!TASK_STATUSES.includes(status)) {
      throw new ApiError(
        400,
        `Invalid status filter. Allowed values: ${TASK_STATUSES.join(', ')}`
      );
    }
    filter.status = status;
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
};

// GET /api/v1/tasks/:id
export const getTaskById = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found');

  res.status(200).json({ success: true, data: task });
};

// PUT /api/v1/tasks/:id
export const updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    pickAllowedFields(req.body),
    { new: true, runValidators: true }
  );
  if (!task) throw new ApiError(404, 'Task not found');

  res.status(200).json({ success: true, data: task });
};

// DELETE /api/v1/tasks/:id
export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!task) throw new ApiError(404, 'Task not found');

  res.status(200).json({ success: true, message: 'Task deleted' });
};