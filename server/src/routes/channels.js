import { Router } from 'express';
import Channel from '../models/Channel.js';
import Video from '../models/Video.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const channelName = (req.body.channelName || '').trim();
    if (channelName.length < 3) return res.status(400).json({ message: 'Channel name must be at least 3 characters.' });
    if (await Channel.findOne({ owner: req.user._id })) return res.status(409).json({ message: 'You already have a channel.' });
    const channel = await Channel.create({ channelName, description: req.body.description || '', owner: req.user._id });
    res.status(201).json(channel);
  } catch (e) { next(e); }
});
router.get('/mine', requireAuth, async (req, res, next) => {
  try { res.json(await Channel.findOne({ owner: req.user._id })); } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id).populate('owner', 'username');
    if (!channel) return res.status(404).json({ message: 'Channel not found.' });
    const videos = await Video.find({ channel: channel._id }).sort({ createdAt: -1 });
    res.json({ channel, videos });
  } catch (e) { next(e); }
});
export default router;
