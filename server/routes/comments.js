import express from "express";
import { createComment, getCommentsForPost, getCommentById, updateComment, deleteComment } from "../controllers/comments.js";

const router = express.Router();

router.post("/", createComment);
router.get("/:postId", getCommentsForPost);
router.get("/single/:commentId", getCommentById);
router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
