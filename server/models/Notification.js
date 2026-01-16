
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
title: { type: String, required: true },
  body: { type: String, required: true },

  type: {
    type: String,
    enum: ["post", "breaking", "admin"],
    default: "post",
  },

  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  city: String,
  area: String,

  link: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", NotificationSchema);
