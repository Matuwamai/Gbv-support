import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/like_Dislike.js";
import repostRoutes from "./routes/reposts.js";
import caseRoutes from "./routes/cases.js";
import callRoutes from "./routes/emergency_call.js";
import authorityRoutes from "./routes/Authorities.js";
import { UPLOAD_DIR } from "./lib/upload.js";

const app = express();
const port = process.env.PORT || 3000;

// CLIENT_ORIGIN may hold a comma-separated list; when unset, allow any origin (development).
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/reposts", repostRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/authorities", authorityRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 10 MB)" : err.message;
    return res.status(400).json({ message });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON body" });
  }
  console.error("Unhandled Error:", err);
  return res.status(500).json({ message: "Server error" });
});

if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set. Login will fail until it is configured.");
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
