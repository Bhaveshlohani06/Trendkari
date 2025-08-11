// controllers/postController.js
import express from 'express';
import postModel from "../models/postmodel.js";
import slugify from "slugify";
import fs from "fs";
import formidable from "formidable";
import { imagekit } from "../config/imaegkit.js";
import main from '../config/gemini.js';

// CREATE POST
export const createPostController = async (req, res) => {
  try {
    const { title, content, category, tags, isFeatured, status } = req.body;
    const image = req.file;
    
    // Validation
    switch (true) {
      case !title:
        return res.status(400).send({ message: "Title is required" });
      case !content:
        return res.status(400).send({ message: "Content is required" });
      case !category:
        return res.status(400).send({ message: "Category is required" });
    }

    const post = new postModel({
      title,
      content,
      category,
      author: req.user.id,
      slug: slugify(title, { lower: true, strict: true }),
      tags: tags ? tags.split(',') : [],
      isFeatured: isFeatured === 'true',
      status: status || "draft",
    });

    if (image) {
      const fileBuffer = fs.readFileSync(image.path);

      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
        folder: '/posts',
      });

      const optimizedImageUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '1280' },
        ],
      });

      post.image = optimizedImageUrl;
    }

    await post.save();

    res.status(201).send({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
  console.error("Create Post Error:", error.message, error.stack);
  res.status(500).send({
    success: false,
    message: "Error creating post",
    error: error.message,
  });
}
};



// GET ALL POSTS
export const getAllPostsController = async (req, res) => {
  try {
    const posts = await postModel
      .find({})
      .populate("category")
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, posts });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// GET SINGLE POST BY SLUG
export const getPostBySlugController = async (req, res) => {
  try {
    const post = await postModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .populate("author", "name");
    res.status(200).send({ success: true, post });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};


// TOGGLE PUBLISH STATUS
export const togglePublishController = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).send({ success: false, message: "Post not found" });
    }

    post.status = post.status === "published" ? "draft" : "published";
    await post.save();

    res.status(200).send({
      success: true,
      message: `Post ${post.status === "published" ? "published" : "set to draft"}`,
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error toggling status", error });
  }
};


// UPDATE POST
export const updatePostController = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).send({ error: "Image upload error" });

      const { title, content, category, tags, status, isFeatured } = fields;

      const post = await postModel.findById(req.params.id);
      if (!post) return res.status(404).send({ message: "Post not found" });

      post.title = title || post.title;
      post.content = content || post.content;
      post.slug = slugify(title) || post.slug;
      post.category = category || post.category;
      post.tags = tags ? tags.split(",") : post.tags;
      post.status = status || post.status;
      post.isFeatured = isFeatured || post.isFeatured;

      if (files.image) {
        post.image = `/uploads/${files.image.newFilename}`;
      }

      await post.save();
      res.status(200).send({ success: true, message: "Post updated", post });
    });
  } catch (error) {
    res.status(500).send({ success: false, error });
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

export const searchPostsController = async (req, res) => {
  const query = req.query.q || '';
  try {
    const posts = await postModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
};



export const getPostsByUser = async (req, res) => {
  try {
    const posts = await postModel.find({ author: req.params.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching posts" });  
  }
}