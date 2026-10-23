import Joi from 'joi';
import { TASK_STATUSES } from '../models/Task.js';

const title = Joi.string().trim().min(3).max(100);
const description = Joi.string().trim().max(500).allow('');
const status = Joi.string().valid(...TASK_STATUSES);

// Creating: title is required; others get defaults
export const createTaskSchema = Joi.object({
  title: title.required(),
  description: description.default(''),
  status: status.default('pending'),
});

// Updating: every field optional, but at least one must be present
export const updateTaskSchema = Joi.object({
  title,
  description,
  status,
}).min(1);