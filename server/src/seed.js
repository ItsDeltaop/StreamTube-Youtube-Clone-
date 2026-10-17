import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/streamtube');
let user = await User.findOne({ email: 'demo@streamtube.dev' });
if (!user) user = await User.create({ username: 'StreamTube Demo', email: 'demo@streamtube.dev', passwordHash: await bcrypt.hash('DemoPass123!', 12) });
let channel = await Channel.findOne({ owner: user._id });
if (!channel) channel = await Channel.create({ channelName: 'StreamTube Studio', description: 'A collection of tutorials, music, and ideas.', owner: user._id });
if (await Video.countDocuments() === 0) {
  const samples = [
    ['Build a Modern React App', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 'https://www.youtube.com/embed/SqcY0GlETPk', 'Technology', 'A practical introduction to modern React.'],
    ['JavaScript Concepts You Should Know', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800', 'https://www.youtube.com/embed/W6NZfCO5SIk', 'Technology', 'Core JavaScript concepts for developers.'],
    ['Relaxing Nature and Waterfalls', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800', 'https://www.youtube.com/embed/lTRiuFIWV54', 'Nature', 'Take a quiet break with nature.'],
    ['A Short Tour of Space', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800', 'https://www.youtube.com/embed/libKVRa01L8', 'Science', 'A visual tour of our universe.'],
    ['Easy Homemade Pasta', 'https://images.unsplash.com/photo- pasta', 'https://www.youtube.com/embed/9C2qG7W6x0A', 'Cooking', 'A simple cooking inspiration video.'],
    ['Focus Music for Deep Work', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800', 'https://www.youtube.com/embed/jfKfPfyJRdk', 'Music', 'Background music for focused work.'],
    ['Design Better Interfaces', 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800', 'https://www.youtube.com/embed/c9Wg6Cb_YlU', 'Design', 'UI principles and visual design basics.'],
    ['Travel: Hidden Mountain Views', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 'https://www.youtube.com/embed/ScMzIvxBSi4', 'Travel', 'Scenic mountains and travel inspiration.']
  ];
  await Video.insertMany(samples.map(([title, thumbnailUrl, videoUrl, category, description], i) => ({
    title, thumbnailUrl: thumbnailUrl.includes('photo- pasta') ? 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800' : thumbnailUrl,
    videoUrl, category, description, channel: channel._id, uploader: user._id, views: (i + 1) * 1284
  })));
}
console.log('Seed complete. Demo login: demo@streamtube.dev / DemoPass123!');
await mongoose.disconnect();
