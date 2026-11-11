import express from "express";
import {
  createRepost,
  getRepostsByUser,
  getRepostsForPost,
  deleteRepost,
  getAllRepost,
} from "../controllers/reposts.js";
import { requireAuth } from "../lib/auth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createRepost);
router.get("/", getAllRepost);
router.get("/user/:userId", getRepostsByUser);
router.get("/post/:postId", getRepostsForPost);
router.delete("/:repostId", deleteRepost);

export default router;
