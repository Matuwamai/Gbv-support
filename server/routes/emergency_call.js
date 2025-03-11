import express from "express";
import { initiateEmergencyCall } from "../controllers/emergency_call.js";

const router = express.Router();

// POST endpoint to initiate an emergency call
router.post("/", initiateEmergencyCall);

export default router;
