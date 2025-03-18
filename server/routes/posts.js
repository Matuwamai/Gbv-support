import express from "express";
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from "../controllers/posts.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");
console.log("Upload directory:", uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit file size to 5MB
});

  
  router.post("/", upload.single("mediaUrl"), createPost);
router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:postId", getPostById);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost); 

export default router;
