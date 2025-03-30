import express from "express";
import { createRepost,  getRepostsByUser, deleteRepost, getAllRepost } from "../controllers/reposts.js";

const router = express.Router();


router.post("/", createRepost);
// router.get("/post/:postId", getRepostsByPost);
router.get("/user/:userId", getRepostsByUser);
router.delete("/:repostId", deleteRepost);
router.get("/", getAllRepost);

export default router;
