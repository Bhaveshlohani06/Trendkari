import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import { createComment, listComments, deleteComment, updateComment } from "../controllers/commentController.js";

const router = express.Router();

// list & create by post slug
router.get("/posts/:slug/comments", listComments);
router.post("/posts/:slug/comments", requireSignIn, createComment);

// edit/delete comment by id
router.patch("/comments/:id", requireSignIn, updateComment);
router.delete("/comments/:id", requireSignIn, deleteComment);

export default router;
