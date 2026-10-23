import ApiError from '../utils/ApiError.js';

// A MongoDB ObjectId is exactly 24 hex characters
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export const validateObjectId = (req, res, next) => {
  if (!OBJECT_ID_REGEX.test(req.params.id)) {
    return next(new ApiError(400, 'Invalid task id'));
  }
  next();
};