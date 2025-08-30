import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../config/env.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for token in cookies first, then in Authorization header
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export const generateToken = (id) => {
  if (!JWT_SECRET) {
    throw new Error('JWT secret not configured');
  }
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

export const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/', // Cookie available across the site
  };

  res.cookie('jwt', token, cookieOptions);
};
 
export const clearTokenCookie = (res) => {
  res.cookie('jwt', '', {
    expires: new Date(0), // Expires immediately
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
};
