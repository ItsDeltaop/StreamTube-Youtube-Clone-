import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Please sign in first.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-only-secret');
    req.user = await User.findById(payload.id).select('-passwordHash');
    if (!req.user) return res.status(401).json({ message: 'Account no longer exists.' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
