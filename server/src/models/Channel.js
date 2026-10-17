import mongoose from 'mongoose';
const channelSchema = new mongoose.Schema({
  channelName: { type: String, required: true, trim: true, maxlength: 60 },
  description: { type: String, default: '', maxlength: 500 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  subscribers: { type: Number, default: 0 },
  channelBanner: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('Channel', channelSchema);
