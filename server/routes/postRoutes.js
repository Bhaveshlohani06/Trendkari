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
getPostsByUser,
updatePostController
, approvePost,
  // getAllPostsAdmin,
  rejectPost,
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

// APPROVE POST
router.put(
  "/admin/posts/approve/:id",
  requireSignIn,
  isAdmin,
  approvePost
);


// admin routes
// router.get("/posts", isAdmin, getAllPostsAdmin);

router.put("/post/:id/approve", isAdmin, approvePost);
router.put("/post/:id/reject", isAdmin, rejectPost);


// UPDATE POST
router.put("/update-post/:id", requireSignIn,  upload.single("image"), updatePostController);

// DELETE POST
router.delete("/delete-post/:id", requireSignIn, deletePostController);

router.post("/generate",requireSignIn, generatePostContent);

router.post("/humanize",requireSignIn, humanizeBlog);


router.get('/profile/:id', requireSignIn, getPostsByUser)






  
export default router;
