import express from "express";
import { makeEmergencyCall } from "../controllers/emergency_call.js";

const router = express.Router();

router.post("/call", makeEmergencyCall);

export default router;
