import express from "express";
import { toggleLikePost as toggleLike } from "../controllers/likeController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:postId", requireSignIn, toggleLike);

export default router;
