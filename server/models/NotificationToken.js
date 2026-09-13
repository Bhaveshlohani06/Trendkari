import mongoose from "mongoose";

const NotificationTokenSchema = new mongoose.Schema(
  {
    token: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
      index: true,
    },

    deviceId: { 
      type: String, 
      index: true 
    },

    platform: {
      type: String,
      enum: ["web", "android"],
      default: "android",
    },

    city: { 
      type: String, 
      default: "General" 
    },
    area: String,
    appVersion: String,
    userAgent: String,

    isValid: { 
      type: Boolean, 
      default: true, 
      index: true 
    },
    lastSeenAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

// Performance Indexes
NotificationTokenSchema.index({ user: 1, deviceId: 1 });
NotificationTokenSchema.index({ deviceId: 1, isValid: 1 });
NotificationTokenSchema.index({ isValid: 1 });

export default mongoose.model("NotificationToken", NotificationTokenSchema);