import express from "express";
import { makeEmergencyCall } from "../controllers/emergency_call.js";
import { requireAuth } from "../lib/auth.js";

const router = express.Router();

// Each call costs money and rings a real phone, so cap how often one account can trigger it.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_CALLS_PER_WINDOW = 3;
const recentCalls = new Map();

const limitCalls = (req, res, next) => {
  const now = Date.now();
  const calls = (recentCalls.get(req.user.id) || []).filter((time) => now - time < WINDOW_MS);
  if (calls.length >= MAX_CALLS_PER_WINDOW) {
    return res.status(429).json({
      error: "Too many call requests. Please call a hotline directly or try again in a few minutes.",
    });
  }
  calls.push(now);
  recentCalls.set(req.user.id, calls);
  return next();
};

router.post("/call", requireAuth, limitCalls, makeEmergencyCall);

export default router;
