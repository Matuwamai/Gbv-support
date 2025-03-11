import express from "express";
import { createRepost, getRepostsByPost, getRepostsByUser, deleteRepost } from "../controllers/reposts.js";

const router = express.Router();


router.post("/", createRepost);

router.get("/post/:postId", getRepostsByPost);

router.get("/user/:userId", getRepostsByUser);

router.delete("/:repostId", deleteRepost);

export default router;
