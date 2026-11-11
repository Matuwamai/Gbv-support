import express from "express";
import {
  createAuthority,
  getAllAuthorities,
  getAuthorityById,
  updateAuthority,
  deleteAuthority,
} from "../controllers/Authorites.js";
import { requireAuth, requireStaff } from "../lib/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getAllAuthorities);
router.get("/:authorityId", getAuthorityById);
router.post("/", requireStaff, createAuthority);
router.put("/:authorityId", requireStaff, updateAuthority);
router.delete("/:authorityId", requireStaff, deleteAuthority);

export default router;
