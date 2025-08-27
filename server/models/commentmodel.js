import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // for replies
    status: { type: String, enum: ["published", "deleted"], default: "published" }
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, createdAt: -1 }); // fast listing per post

export default mongoose.model("Comment", commentSchema);
