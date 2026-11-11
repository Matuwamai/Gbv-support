import express from "express";
import {
  createComment,
  getCommentsForPost,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/comments.js";
import { requireAuth } from "../lib/auth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createComment);
router.get("/single/:commentId", getCommentById);
router.get("/:postId", getCommentsForPost);
router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
