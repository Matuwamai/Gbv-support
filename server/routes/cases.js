import express from "express";
import { 
  createCase, 
  getAllCases, 
  getCaseById, 
  updateCase, 
  deleteCase 
} from "../controllers/cases.js";

const router = express.Router();
router.post("/", createCase);
router.get("/", getAllCases);
router.get("/:caseId", getCaseById);
router.put("/:caseId", updateCase);
router.delete("/:caseId", deleteCase);

export default router;
