import express from "express";
import { likeOrDislikePost, getPostReactions } from "../controllers/like_Dislike.js";

const router = express.Router();
router.post("/", likeOrDislikePost);
router.get("/:postId", getPostReactions);

export default router;
