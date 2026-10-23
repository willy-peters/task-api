import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const signToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    algorithm: 'HS256',
  });