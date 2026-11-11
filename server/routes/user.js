import express from "express";
import { registerUser, loginUser, logoutUser, deleteUser, getAllUsers, updateUser, getUserById } from "../controllers/user.js"
import { uploadImage } from "../lib/upload.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.delete("/delete/:userId", deleteUser);
router.put("/:userId", uploadImage.single("profileImage"), updateUser);
router.get("/", getAllUsers); 
router.get("/:userId", getUserById); 

export default router;
