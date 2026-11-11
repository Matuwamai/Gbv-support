import express from "express";
import { likeOrDislikePost, getPostReactions } from "../controllers/like_Dislike.js";
import { requireAuth } from "../lib/auth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", likeOrDislikePost);
router.get("/:postId", getPostReactions);

export default router;
