import express from "express";
import {
  createCase,
  getAllCases,
  getCaseById,
  updateCase,
  deleteCase,
} from "../controllers/cases.js";
import { requireAuth, requireStaff } from "../lib/auth.js";

const router = express.Router();

router.use(requireAuth);

// Anyone signed in can report a post; managing reports is for admins/moderators.
router.post("/", createCase);
router.get("/", requireStaff, getAllCases);
router.get("/:caseId", requireStaff, getCaseById);
router.put("/:caseId", requireStaff, updateCase);
router.delete("/:caseId", requireStaff, deleteCase);

export default router;
