import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { signToken } from '../utils/generateToken.js';

// POST /api/v1/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email is already registered');

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);

  res.status(201).json({ success: true, token, user });
};

// POST /api/v1/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // password has select:false, so we must ask for it explicitly
  const user = await User.findOne({ email }).select('+password');
  const passwordOk = user && (await user.comparePassword(password));

  // Same message for "no such user" and "wrong password" (prevents user enumeration)
  if (!passwordOk) throw new ApiError(401, 'Invalid email or password');

  const token = signToken(user._id);
  res.status(200).json({ success: true, token, user });
};

// GET /api/v1/auth/me  (protected)
export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};