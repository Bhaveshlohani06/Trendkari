// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//       trim: true
//     },
//     content: {
//   type: mongoose.Schema.Types.Mixed,
//       required: true,
//     },
//     image: {
//       type: String, 
//       default: "",
//     },

//       language: {
//     type: String,
//     enum: ["hi", "en"],
//     default: "hi",
//     index: true,
//     // required: true

//   },
//   location: {
//     type: String,
//     enum: [
//       "kota",
//       "ramganjmandi",
//       "sangod",
//       "ladpura",
//       "kaithoon",
//       "modak",
//       "rural-kota"
//     ],
//     index: true,
//     // required: true
//   },

//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },
//     tags: [
//       {
//         type: String,
//         trim: true,
//         lowercase: true,
//       },
//     ],
//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },
//     status: {
//       type: String,
//     enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//         likes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//       },
//     ],

//     commentsCount: {
//       type: Number,
//       default: 0,
//     },

//     likesCount: {
//       type: Number,
//       default: 0,
//     },

//   },
//   { timestamps: true }
// );


// postSchema.index({ author: 1 });
// postSchema.index({ likes: 1 });
// export default mongoose.model("Post", postSchema);


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
      trim: true,
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
        "rural-kota",
      ],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
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
      index: true,
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

// Single field indexes for query optimization
postSchema.index({ status: 1, createdAt: -1 });

// Compound Text Index for Bilingual & Hinglish Search
postSchema.index(
  {
    title: "text",
    slug: "text",
    description: "text",
    tags: "text",
  },
  {
    weights: {
      title: 10,
      slug: 5,
      tags: 5,
      description: 1,
    },
    default_language: "none", // Keeps raw tokens intact for Hinglish slugs (e.g. "rajasthan-me-aaj-ka-mausam") and Hindi Devanagari text
    name: "bilingual_search_index",
  }
);

export default mongoose.model("Post", postSchema);