import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/like_Dislike.js";
import repostRoutes from "./routes/reposts.js";
import caseRoutes from "./routes/cases.js";
import emergencyCallRoutes from "./routes/emergency_call.js"

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/reposts", repostRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/emergency-calls", emergencyCallRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });