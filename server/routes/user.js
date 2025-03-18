import express from "express";
import { registerUser, loginUser, logoutUser, deleteUser, getAllUsers, updateUser, getUserById } from "../controllers/user.js"
import multer from "multer";
const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.delete("/delete/:userId", deleteUser);
router.put("/:userId", upload.single("profileImage"), updateUser);
router.get("/", getAllUsers); 
router.get("/:userId", getUserById); 

export default router;
