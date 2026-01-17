// controllers/postController.js
import express from 'express';
import postModel from "../models/postmodel.js";
import slugify from "slugify";
import fs from "fs";
import formidable from "formidable";
import { imagekit } from "../config/imaegkit.js";
import main from '../config/gemini.js';
//import { generateSlug } from '../helper/slugGenerator.js';
import { generateSlug } from '../utils/slugify.js';
// import { hindiToRoman } from '../utils/slugify.js';
// import {transliterate} from "transliteration";
import Notification from '../models/Notification.js';
import { sendBroadcastPush } from './notificationController.js';
import { broadcastPush } from '../helper/pushService.js';



//


// CREATE POST
// export const createPostController = async (req, res) => {
//   try {
//     const { title, content, language, location, category, tags, isFeatured } = req.body;
//     const image = req.file;
    
//     // Validation
//     switch (true) {
//       case !title:
//         return res.status(400).send({ message: "Title is required" });
//       case !content:
//         return res.status(400).send({ message: "Content is required" });
//       case !category:
//         return res.status(400).send({ message: "Category is required" });
//         case !language:
//         return res.status(400).send({ message: "Langugage is required" });
//         case !location:
//         return res.status(400).send({ message: "Location is required" });
//     }
//     // Generate slug
//     //   const baseSlug = generateSlug(title);

//     // if (!baseSlug) {
//     //   return res.status(400).send({ message: "Slug generation failed" });
//     // }

//     // // 🔁 Ensure uniqueness
//     // let slug = baseSlug;
//     // let count = 1;

//     // while (await postModel.exists({ slug })) {
//     //   slug = `${baseSlug}-${count++}`;
//     // }     


//     // ✅ Slug generation with Hindi transliteration
//     let slug; 
//     if (language === "hindi") {
//       const romanizedTitle = hindiToRoman(title);
//       slug = generateSlug(romanizedTitle);
//     } else {
//       slug = generateSlug(title);
//     }


// const post = new postModel({
//   title,
//   content,
//   category,
//   author: req.user.id,
//   language,
//   location,
//   slug,
//   tags: tags ? tags.split(",") : [],
//   isFeatured: isFeatured === "true",

//   // 🔒 FORCE moderation
//   status: "pending",
//   isPublished: false
// });


//     if (image) {
//       const fileBuffer = fs.readFileSync(image.path);

//       const response = await imagekit.upload({
//         file: fileBuffer,
//         fileName: image.originalname,
//         folder: '/posts',
//       });

//       const optimizedImageUrl = imagekit.url({
//         path: response.filePath,
//         transformation: [
//           { quality: 'auto' },
//           { format: 'webp' },
//           { width: '1280' },
//         ],
//       });

//       post.image = optimizedImageUrl;
//     }

//            console.log("TITLE:", title);
// console.log("GENERATED SLUG:", slug);

//     await post.save();

//     res.status(201).send({
//       success: true,
//       message: "Post submitted for admin approval",
//       post,
//     });
//   } catch (error) {
//   console.error("Create Post Error:", error.message, error.stack);
//   res.status(500).send({
//     success: false,
//     message: "Error creating post",
//     error: error.message,
//   });
// }
// };

export const createPostController = async (req, res) => {
  try {
    const {
      title,
      content,
      language,
      location,
      category,
      tags,
      isFeatured,
    } = req.body;

    const image = req.file;

    // ✅ Validation
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!content) return res.status(400).json({ message: "Content is required" });
    if (!category) return res.status(400).json({ message: "Category is required" });
    if (!language) return res.status(400).json({ message: "Language is required" });
    if (!location) return res.status(400).json({ message: "Location is required" });

  const baseSlug = generateSlug(title);

if (!baseSlug) {
  return res.status(400).json({ message: "Slug generation failed" });
}

// Ensure uniqueness
let slug = baseSlug;
let count = 1;

while (await postModel.exists({ slug })) {
  slug = `${baseSlug}-${count++}`;
}

    // ✅ Create post
    const post = new postModel({
      title,
      content,
      category,
      author: req.user.id,
      language,
      location,
      slug,
      tags: tags ? tags.split(",") : [],
      isFeatured: isFeatured === "true",
      status: "pending",
      isPublished: false,
    });

    // ✅ Image upload (safe)
    if (image) {
      const fileBuffer = fs.readFileSync(image.path);

      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
        folder: "/posts",
      });

      post.image = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    console.log("TITLE:", title);
    console.log("FINAL SLUG:", slug);

    await post.save();

    res.status(201).json({
      success: true,
      message: "Post submitted for admin approval",
      post,
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
    });
  }
};



// GET ALL POSTS
// export const getAllPostsController = async (req, res) => {
//   try {
//     const posts = await postModel
//       .find({})
//       .populate("category")
//       .populate("author", "name")
//       .sort({ createdAt: -1 });
//     res.status(200).send({ success: true, posts });
//   } catch (error) {
//     res.status(500).send({ success: false, error });
//   }
// };

export const getAllPostsController = async (req, res) => {
  try {
    const { language, location, category } = req.query;

    const filter = {
      status: "approved", // important
    };

    if (language) {
      filter.language = language;
    }

    if (location) {
      filter.location = location;
    }

    if (category) {
      filter.category = category;
    }

    const posts = await postModel
      .find(filter)
      .populate("category")
      .populate("author", "name")
      .skip(((req.query.page || 1) - 1) * (req.query.limit || 10))
      .limit(parseInt(req.query.limit) || 10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
    });
  }
};


//GET SINGLE POST BY SLUG


// export const getPostBySlugController = async (req, res) => {
//   try {
//     const post = await postModel
//       .findOne({ slug: req.params.slug,
//         status: "approved"
//        })
//       .populate("category")
//       .populate("author", "name", "location");
//     res.status(200).send({ success: true, post });
//   } catch (error) {
//     res.status(500).send({ success: false, error });
//   }
// };
  


export const getPostBySlugController = async (req, res) => {
  try {
    // ✅ Decode slug (VERY IMPORTANT for Hindi)
    const decodedSlug = decodeURIComponent(req.params.slug);

    const post = await postModel
      .findOne({
        slug: decodedSlug,
        status: "approved",
      })
      .populate("category")
      .populate("author", "name");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or not approved",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log("Raw slug:", req.params.slug);
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post",
    });
  }
};



// export const getPostBySlugController = async (req, res) => {
//   try {
//     const post = await postModel
//       .findOne({
//         slug: req.params.slug,
//         status: "approved",
//         isPublished: true,
//       })
//       .populate("category")
//       .populate("author", "name");

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found or not approved",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       post,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching post",
//     });
//   }
// };


// TOGGLE PUBLISH STATUS
// export const togglePublishController = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const post = await postModel.findById(id);
//     if (!post) {
//       return res.status(404).send({ success: false, message: "Post not found" });
//     }

//     post.status = post.status === "published" ? "draft" : "published";
//     await post.save();

//     res.status(200).send({
//       success: true,
//       message: `Post ${post.status === "published" ? "published" : "set to draft"}`,
//       post,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: "Error toggling status", error });
//   }
// };


// GET PENDING POSTS FOR ADMIN
export const getPendingPosts = async (req, res) => {
  const posts = await postModel
    .find({ status: "pending" })
    .populate("author", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, posts });
};

// GET ALL POSTS FOR ADMIN
export const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await postModel.find({})
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

  // APPROVE OR REJECT POST


//     export const approvePost = async (req, res) => {
//   await postModel.findByIdAndUpdate(req.params.id, {
//     status: "approved",
//     isPublished: true,
//   }
// );
//   res.json({ success: true, message: "Post approved" });
// };


// export const approvePost = async (req, res) => {
//   try {
//     // 1️⃣ Approve post and GET updated post
//     const post = await postModel.findByIdAndUpdate(
//       req.params.id,
//       {
//         status: "approved",
//         isPublished: true,
//       },
//       { new: true } // 🔥 IMPORTANT
//     );

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     // 2️⃣ Save notification
//  const notification = await Notification.create({
//   title: "नई खबर प्रकाशित हुई 📰",
//   body: post.title,
//   type: "post",
//   postId: post._id,
//   city: post.city,
//   area: post.area,
//   link: `https://www.trendkari.in/${post.city}/article/${post.slug}`,
// });

// console.log("✅ Notification saved:", notification);


//     // 3️⃣ Send push (do NOT block approval if it fails)
//     sendBroadcastPush({
//        title: "नई खबर",
//       body: post.title,
//       platform: "web",
//       link: notification.link,
//     }).catch(err =>
//       console.error("Push failed:", err.message)
//     );

//     // 4️⃣ Response
//     res.json({
//       success: true,
//       message: "Post approved & notification sent",
//     });

//   } catch (error) {
//     console.error("Approve post error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


export const approvePost = async (req, res) => {
  try {
    const post = await postModel.findByIdAndUpdate(
      req.params.id,
      { status: "approved", isPublished: true },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false });
    }

    const link = `https://www.trendkari.in/${post.city}/article/${post.slug}`;

    await Notification.create({
      title: "नई खबर प्रकाशित हुई 📰",
      body: post.title,
      type: "post",
      postId: post._id,
      city: post.city,
      area: post.area,
      link,
    });

    // ✅ THIS WORKS
    broadcastPush({
      title: "नई खबर",
      body: post.title,
      platform: "web",
      link,
    }).catch(console.error);

    res.json({
      success: true,
      message: "Post approved & broadcast sent",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};


// REJECT POST
export const rejectPost = async (req, res) => {
  await postModel.findByIdAndUpdate(req.params.id, {
    status: "rejected",
    isPublished: false,
  });
  res.json({ success: true, message: "Post rejected" });
};


// UPDATE POST
export const updatePostController = async (req, res) => {
  try {
    const { title, description, content, category, tags, status, isFeatured } = req.body;

    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).send({ message: "Post not found" });

    // Update fields
    if (title) {
      post.title = title;
      post.slug = slugify(title.toString(), { lower: true, strict: false });
    }
    post.description = description || post.description;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags ? JSON.parse(tags).map(tag => tag.trim().toLowerCase()) : post.tags;
      if (req.user.role === "admin" && status) {
      post.status = status;
        }
    if (typeof isFeatured !== "undefined") {
      post.isFeatured = isFeatured === "true" || isFeatured === true;
    }
    post.author = req.user.id || post.author;

    // Handle new image if uploaded
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: req.file.originalname,
        folder: "/posts",
      });

      const optimizedImageUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });

      post.image = optimizedImageUrl;
    }

    await post.save();

    res.status(200).send({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update Post Error:", error);
    res.status(500).send({ success: false, error: error.message });
  }
};


// DELETE POST
export const deletePostController = async (req, res) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).send({ message: "Post not found" });
    res.status(200).send({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};


//AI
// Generate post content using AI
export const generatePostContent = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        message: "Prompt is required" 
      });
    }

    const generatedContent = await main("Generate a SEO Friendly blog content for this topic in simple text format: " + prompt);
    
    console.log("Generated content:", generatedContent);

    if (!generatedContent) {
      return res.status(500).json({
        success: false,
        message: "Content generation failed"
      });
    }

    // Convert markdown/newlines to HTML
    const htmlContent = generatedContent
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
      .replace(/\n\n/g, '</p><p>') // Paragraphs
      .replace(/\n/g, '<br/>'); // Line breaks

    res.status(200).json({
      success: true,
      content: htmlContent // Return HTML formatted content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}


export const humanizeBlog = async (req, res) => {
  try {
    const { htmlContent } = req.body;

    if (!htmlContent) {
      return res.status(400).json({
        success: false,
        message: "htmlContent is required",
      });
    }

    const humanizePrompt = `
Take the following article and rewrite it to sound like it was written by a human, directly from the first word. Do not add any introductory or transition sentence.
Use contractions (like "didn't", "wasn't"), a conversational tone, and break long sentences.
Make it engaging but still informative. Avoid robotic phrasing.
✅ Format the output in proper HTML using <p>, <br>, <strong>, <em> tags etc.
✅ Bold important words using <strong>
✅ Italicize engaging or emotional expressions using <em>
✅ Start new paragraphs with <p> tags
✅ Do not wrap the whole output in <html> or <body> tags — just the inner HTML.

Article:
${htmlContent}
`;

    const humanizedContent = await main(humanizePrompt); // Assuming "main()" is your Gemini AI function

    res.status(200).json({
      success: true,
      content: humanizedContent || "No content generated",
    });
  } catch (error) {
    console.error("Error in humanizeBlog:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// backend/controllers/postController.js
// controllers/postController.js


////// Get Posts By User /////
export const getPostsByUser = async (req, res) => {
  try {
    const posts = await postModel.find({ author: req.params.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching posts" });  
  }
}


