import express from "express";
import {
  getSuggestedUsers,
  getAllUsers,
  followUser,
  unfollowUser,
} from "../controllers/userController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= USER DISCOVERY ================= */

// Suggested users
router.get("/suggested", requireSignIn, getSuggestedUsers);

// Get all users (pagination + filter)
router.get("/", requireSignIn, getAllUsers);

/* ================= FOLLOW SYSTEM ================= */

// Follow a user
router.post("/:userId/follow", requireSignIn, followUser);

// Unfollow a user
router.post("/:userId/unfollow", requireSignIn, unfollowUser);

export default router;
 