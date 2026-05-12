import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

/**
 * Protect routes — verifies JWT token from Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    if (!req.user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized — invalid token' });
  }
};

/**
 * Restrict route to specific roles
 * Usage: authorize('admin', 'doctor')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};
