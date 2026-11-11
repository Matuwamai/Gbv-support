import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  getPostsByUser,
  deletePost,
} from "../controllers/posts.js";
import { uploadMedia } from "../lib/upload.js";

const router = express.Router();

router.post("/", uploadMedia.single("mediaUrl"), createPost);
router.get("/", getAllPosts);
router.get("/user/:userId", getPostsByUser);
router.get("/:postId", getPostById);
router.put("/:postId", uploadMedia.single("mediaUrl"), updatePost);
router.delete("/:postId", deletePost);

export default router;
