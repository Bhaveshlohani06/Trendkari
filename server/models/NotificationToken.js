import mongoose from "mongoose";

const NotificationTokenSchema = new mongoose.Schema({
  token: { type: String, unique: true, index: true },

  platform: {
    type: String,
    enum: ["web", "android"],
    required: true
  },

  city: String,
  area: String,
  appVersion: String,

  isValid: { type: Boolean, default: true },
  lastSeenAt: Date,
}, { timestamps: true });

export default mongoose.model("NotificationToken", NotificationTokenSchema);
