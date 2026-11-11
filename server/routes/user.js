import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getUserById,
} from "../controllers/user.js";
import { uploadImage } from "../lib/upload.js";
import { requireAuth, requireStaff, canModify } from "../lib/auth.js";

const router = express.Router();

// Users may only read or change their own account unless they are staff.
const requireSelfOrStaff = (req, res, next) =>
  canModify(req.user, parseInt(req.params.userId, 10))
    ? next()
    : res.status(403).json({ message: "You can only access your own account" });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/", requireAuth, requireStaff, getAllUsers);
router.get("/:userId", requireAuth, requireSelfOrStaff, getUserById);
router.put("/:userId", requireAuth, requireSelfOrStaff, uploadImage.single("profileImage"), updateUser);
router.delete("/delete/:userId", requireAuth, requireSelfOrStaff, deleteUser);

export default router;
