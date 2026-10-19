import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { HttpError } from '../utils/httpError.js';

const toUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError(400, 'Name, email and password are required');
  }
  if (typeof password !== 'string' || password.length < 6) {
    throw new HttpError(400, 'Password must be at least 6 characters');
  }
  if (typeof email !== 'string') {
    throw new HttpError(400, 'Please enter a valid email');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new HttpError(400, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    user: toUserResponse(user),
    token: generateToken(user._id),
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required');
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new HttpError(400, 'Email and password must be valid strings');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new HttpError(401, 'Invalid email or password');
  }

  res.json({
    user: toUserResponse(user),
    token: generateToken(user._id),
  });
};

// GET /api/auth/me (protected)
export const getMe = async (req, res) => {
  res.json({ user: toUserResponse(req.user) });
};
