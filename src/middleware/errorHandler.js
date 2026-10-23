import mongoose from 'mongoose';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';

// Runs when no route matched: turns it into a 404 ApiError
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Converts known library errors into ApiErrors.

const toApiError = (err) => {
  if (err instanceof ApiError) return err;

  // Malformed JSON / oversized body (thrown by express.json())
  if (err.type === 'entity.parse.failed') {
    return new ApiError(400, 'Malformed JSON in request body');
  }
  if (err.type === 'entity.too.large') {
    return new ApiError(413, 'Request body too large');
  }

  // Mongoose schema validation failed
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return new ApiError(400, 'Validation failed', details);
  }

  // Invalid ObjectId, or a value of the wrong type
  if (err instanceof mongoose.Error.CastError) {
    return new ApiError(400, `Invalid value for '${err.path}'`);
  }

  // Duplicate key (unique index violation), e.g. registering the same email
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    return new ApiError(409, `Duplicate value for '${field}'`);
  }

  // JWT errors (used from Phase 6)
  if (err.name === 'TokenExpiredError') {
    return new ApiError(401, 'Token expired, please log in again');
  }
  if (err.name === 'JsonWebTokenError') {
    return new ApiError(401, 'Invalid token');
  }

  return null;
};

// Express recognizes error middleware by its 4 parameters: do not remove `next`.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // If the response already started, delegate to Express's default handler
  if (res.headersSent) return next(err);

  const apiError = toApiError(err);
  const statusCode = apiError ? apiError.statusCode : 500;

  // Never leak internal error messages to clients in production
  const message = apiError
    ? apiError.message
    : config.nodeEnv === 'production'
      ? 'Internal server error'
      : err.message;

  if (statusCode >= 500) {
    console.error('Unhandled error:', err);
  }

  const body = { success: false, message };
  if (apiError?.details) body.errors = apiError.details;
  if (statusCode >= 500 && config.nodeEnv !== 'production') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};