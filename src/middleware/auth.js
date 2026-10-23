import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

// Protects a route: requires "Authorization: Bearer <token>"
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized: no token provided');
  }

  const token = header.split(' ')[1];

  // Throws JsonWebTokenError / TokenExpiredError on failure.
  // Express 5 forwards that to errorHandler, which maps it to a 401.
  const decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'The user for this token no longer exists');

  req.user = user;
  next();
};