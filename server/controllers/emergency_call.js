import twilio from "twilio";
import prisma from "../lib/prisma.js";

const ISSUE_TYPES = ["SEXUAL_HARASSMENT", "DOMESTIC_VIOLENCE", "OTHER"];
const DEFAULT_SUPPORT_LINE = "+15102413544";

// Support line each issue type is connected to; configurable via .env.
const getSupportLine = (issueType) =>
  process.env[`EMERGENCY_NUMBER_${issueType}`] || DEFAULT_SUPPORT_LINE;

let client;
// Create the Twilio client lazily so the server can start without credentials.
const getTwilioClient = () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) return null;
  client ??= twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  return client;
};

// Accepts "+254 712 345 678", "254712345678" or a local "0712345678" and
// returns E.164 ("+254712345678"), or null if it can't be a phone number.
export const normalizePhoneNumber = (input) => {
  if (typeof input !== "string" && typeof input !== "number") return null;
  const raw = String(input).trim();
  let digits = raw.replace(/\D/g, "");
  if (!raw.startsWith("+") && digits.startsWith("0")) {
    const countryCode = (process.env.DEFAULT_COUNTRY_CODE || "254").replace(/\D/g, "");
    digits = countryCode + digits.replace(/^0+/, "");
  }
  return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null;
};

export const makeEmergencyCall = async (req, res) => {
  try {
    const { phoneNumber, issueType } = req.body;
    if (!phoneNumber || !issueType) {
      return res.status(400).json({ error: "Phone number and issue type are required" });
    }
    if (!ISSUE_TYPES.includes(issueType)) {
      return res.status(400).json({ error: "Invalid issue type" });
    }
    const callerNumber = normalizePhoneNumber(phoneNumber);
    if (!callerNumber) {
      return res.status(400).json({ error: "Please enter a valid phone number" });
    }

    const twilioClient = getTwilioClient();
    if (!twilioClient) {
      return res
        .status(503)
        .json({ error: "Emergency calling is not configured. Please call a hotline directly." });
    }

    const supportLine = getSupportLine(issueType);

    // Ring the person who asked for help, then connect them to the support line.
    const response = new twilio.twiml.VoiceResponse();
    response.say("Connecting you to a support line. Please stay on the line.");
    response.dial(supportLine);

    const call = await twilioClient.calls.create({
      to: callerNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      twiml: response.toString(),
    });

    try {
      await prisma.emergencyCall.create({
        data: { userId: req.user?.id ?? null, phoneNumber: callerNumber, issueType, redirectedTo: supportLine },
      });
    } catch (logError) {
      // Logging must never stop the call from going through.
      console.error("Failed to log emergency call:", logError);
    }

    return res.status(200).json({
      message: "We are calling you now and will connect you to a support line.",
      callSid: call.sid,
    });
  } catch (error) {
    console.error("Twilio Call Error:", error);
    return res
      .status(502)
      .json({ error: "Failed to place the call. Please call a hotline directly." });
  }
};
