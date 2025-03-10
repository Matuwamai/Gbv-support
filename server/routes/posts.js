import express from "express";
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from "../controllers/posts.js";

const router = express.Router();

// Routes
router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:postId", getPostById);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);

export default router;
