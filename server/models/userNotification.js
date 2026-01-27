import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true, // receiver
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // who liked/commented
    },

    type: {
      type: String,
      enum: ["LIKE", "COMMENT", "FOLLOW"],
      required: true,
    },

    PostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    message: {
      type: String,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userNotificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model("UserNotification", userNotificationSchema);
