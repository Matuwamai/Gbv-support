import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";


const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });