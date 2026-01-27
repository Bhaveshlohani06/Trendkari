import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    content: {
  type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    image: {
      type: String, 
      default: "",
    },

      language: {
    type: String,
    enum: ["hi", "en"],
    default: "hi",
    index: true,
    // required: true

  },
  location: {
    type: String,
    enum: [
      "kota",
      "ramganjmandi",
      "sangod",
      "ladpura",
      "kaithoon",
      "modak",
      "rural-kota"
    ],
    index: true,
    // required: true
  },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
    enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
        likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

  },
  { timestamps: true }
);


postSchema.index({ author: 1 });
postSchema.index({ likes: 1 });
export default mongoose.model("Post", postSchema);
