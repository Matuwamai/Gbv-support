import express from "express";
import { registerUser, loginUser, logoutUser, deleteUser, getAllUsers, getUserById } from "../controllers/user.js"

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.delete("/delete/:userId", deleteUser);
router.get("/", getAllUsers); 
router.get("/:userId", getUserById); 

export default router;
