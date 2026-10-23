import ApiError from '../utils/ApiError.js';

// Usage: router.post('/', validate(createTaskSchema), createTask)
export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body ?? {}, {
    abortEarly: false, // report ALL problems, not just the first
    stripUnknown: true, // silently drop fields not in the schema
  });

  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message.replace(/"/g, ''),
    }));
    return next(new ApiError(400, 'Validation failed', details));
  }

  req.body = value; // sanitized + defaults applied
  next();
};