import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

// Only lets the request through if it has a valid token
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HttpError(401, 'Not authorized, please log in');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new HttpError(401, 'Your session is invalid or expired, please log in again');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new HttpError(401, 'This account no longer exists');
  }

  req.user = user;
  next();
};

// Only lets admins through (use AFTER protect)
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    throw new HttpError(403, 'Admin access only');
  }
  next();
};
