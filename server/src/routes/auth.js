import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const makeToken = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: '7d' });
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!/^[\w .-]{3,30}$/.test(username || '')) return res.status(400).json({ message: 'Username must be 3–30 characters.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) return res.status(400).json({ message: 'Enter a valid email address.' });
    if ((password || '').length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email is already registered.' });
    const user = await User.create({ username, email, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: makeToken(user), user: { id: user._id, username: user.username, email: user.email } });
  } catch (e) { next(e); }
});
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    res.json({ token: makeToken(user), user: { id: user._id, username: user.username, email: user.email } });
  } catch (e) { next(e); }
});
router.get('/me', requireAuth, (req, res) => res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email } }));
export default router;
