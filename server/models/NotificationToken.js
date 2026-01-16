import mongoose from "mongoose";

const notificationTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    platform: {
      type: String,
      enum: ["web", "android", "ios"],
      default: "web"
    },

    city: {
      type: String,
      required: true,
      index: true
    },

    area: {
      type: String,
      index: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastUsedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("NotificationToken", notificationTokenSchema);
