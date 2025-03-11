import express from "express";
import {
  createAuthority,
  getAllAuthorities,
  getAuthorityById,
  updateAuthority,
  deleteAuthority,
} from "../controllers/Authorites.js";

const router = express.Router();

router.post("/", createAuthority);
router.get("/", getAllAuthorities);
router.get("/:authorityId", getAuthorityById);
router.put("/:authorityId", updateAuthority);
router.delete("/:authorityId", deleteAuthority);

export default router;
