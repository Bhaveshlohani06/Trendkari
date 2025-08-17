// routes/postRoutes.js
import express from "express";
import {
  createPostController,
  getAllPostsController,
  getPostBySlugController,
  togglePublishController,  
  deletePostController,
  generatePostContent,
  humanizeBlog,
  searchPostsController,
getPostsByUser,
updatePostController
} from "../controllers/postController.js";
import { requireSignIn, isAdmin, allowUsersAndAdmins } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js"; // Import the multer middleware

const router = express.Router();

// CREATE POST
router.post("/create-post",requireSignIn, upload.single('image'), createPostController);

// GET ALL POSTS
router.get("/get-posts", getAllPostsController);

// GET SINGLE POST BY SLUG
router.get("/get-post/:slug", getPostBySlugController);



// TOGGLE PUBLISH STATUS
router.patch("/posts/:id/toggle-publish", togglePublishController);

// UPDATE POST
router.put("/update-post/:id", requireSignIn,  upload.single("image"), updatePostController);

// DELETE POST
router.delete("/delete-post/:id", requireSignIn, deletePostController);

router.post("/generate",requireSignIn, generatePostContent);

router.post("/humanize",requireSignIn, humanizeBlog);

router.get('/search', searchPostsController);

router.get('/profile/:id', requireSignIn, getPostsByUser)






export default router;
