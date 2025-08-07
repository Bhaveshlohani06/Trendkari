// routes/postRoutes.js
import express from "express";
import {
  createPostController,
  getAllPostsController,
  getPostBySlugController,
  togglePublishController,  
  updatePostController,
  deletePostController,
  generatePostContent,
  humanizeBlog,
  searchPostsController,
} from "../controllers/postController.js";
import { requireSignIn, isAdmin, allowUsersAndAdmins } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js"; // Import the multer middleware

const router = express.Router();

// CREATE POST
router.post("/create-post",upload.single('image'), requireSignIn, createPostController);

// GET ALL POSTS
router.get("/get-posts", getAllPostsController);

// GET SINGLE POST BY SLUG
router.get("/get-post/:slug", getPostBySlugController);



// TOGGLE PUBLISH STATUS
router.patch("/posts/:id/toggle-publish", togglePublishController);

// UPDATE POST
router.put("/update-post/:id", requireSignIn, updatePostController);

// DELETE POST
router.delete("/delete-post/:id", requireSignIn, isAdmin, deletePostController);

router.post("/generate",requireSignIn, generatePostContent);

router.post("/humanize",requireSignIn, humanizeBlog);

router.get('/search', searchPostsController);


export default router;
