import mongoose from 'mongoose';

const FcmTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  deviceId: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('FcmToken', FcmTokenSchema);