import { Router } from 'express';
import mongoose from 'mongoose';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    if (req.query.search) filter.title = { $regex: req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    const videos = await Video.find(filter).populate('channel', 'channelName').sort({ createdAt: -1 });
    res.json(videos);
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid video id.' });
    const video = await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('channel', 'channelName owner');
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    res.json(video);
  } catch (e) { next(e); }
});
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id });
    if (!channel) return res.status(403).json({ message: 'Create a channel before uploading videos.' });
    const { title, description, thumbnailUrl, videoUrl, category } = req.body;
    if (![title, thumbnailUrl, videoUrl].every(v => typeof v === 'string' && v.trim())) return res.status(400).json({ message: 'Title, thumbnail URL, and video URL are required.' });
    const video = await Video.create({ title, description, thumbnailUrl, videoUrl, category: category || 'All', channel: channel._id, uploader: req.user._id });
    res.status(201).json(await video.populate('channel', 'channelName'));
  } catch (e) { next(e); }
});
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const video = await Video.findOne({ _id: req.params.id, uploader: req.user._id });
    if (!video) return res.status(404).json({ message: 'Video not found or you do not own it.' });
    for (const key of ['title', 'description', 'thumbnailUrl', 'videoUrl', 'category']) if (req.body[key] !== undefined) video[key] = req.body[key];
    await video.save(); res.json(video);
  } catch (e) { next(e); }
});
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const video = await Video.findOneAndDelete({ _id: req.params.id, uploader: req.user._id });
    if (!video) return res.status(404).json({ message: 'Video not found or you do not own it.' });
    res.json({ message: 'Video deleted.' });
  } catch (e) { next(e); }
});
router.post('/:id/reaction', requireAuth, async (req, res, next) => {
  try {
    const { type } = req.body;
    if (!['like', 'dislike'].includes(type)) return res.status(400).json({ message: 'Reaction must be like or dislike.' });
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    const uid = req.user._id.toString();
    const has = list => list.some(id => id.toString() === uid);
    video.likes = video.likes.filter(id => id.toString() !== uid);
    video.dislikes = video.dislikes.filter(id => id.toString() !== uid);
    if (type === 'like' && !has(video.likes)) video.likes.push(req.user._id);
    if (type === 'dislike' && !has(video.dislikes)) video.dislikes.push(req.user._id);
    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length, myReaction: type });
  } catch (e) { next(e); }
});
router.post('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Comment cannot be empty.' });
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    video.comments.push({ user: req.user._id, username: req.user.username, text });
    await video.save(); res.status(201).json(video.comments.at(-1));
  } catch (e) { next(e); }
});
router.patch('/:id/comments/:commentId', requireAuth, async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    const comment = video?.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    if (comment.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You can only edit your own comments.' });
    comment.text = (req.body.text || '').trim();
    if (!comment.text) return res.status(400).json({ message: 'Comment cannot be empty.' });
    await video.save(); res.json(comment);
  } catch (e) { next(e); }
});
router.delete('/:id/comments/:commentId', requireAuth, async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    const comment = video?.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    if (comment.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You can only delete your own comments.' });
    comment.deleteOne(); await video.save(); res.json({ message: 'Comment deleted.' });
  } catch (e) { next(e); }
});
export default router;
