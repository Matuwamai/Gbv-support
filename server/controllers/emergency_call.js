import { PrismaClient } from "@prisma/client";
import { createRequire } from "module";

const prisma = new PrismaClient();
const require = createRequire(import.meta.url);

// Import Africa's Talking using CommonJS
const africastalking = require("africastalking")({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

// Access the Voice service using the correct property key
const voice = africastalking.VOICE;
if (!voice) {
  throw new Error("Voice service is not available. Check your credentials, account, or SDK version.");
}

export const initiateEmergencyCall = async (req, res) => {
  try {
    const { phoneNumber, issueType } = req.body;
    if (!phoneNumber || !issueType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Determine destination number based on issue type
    let destinationNumber;
    if (issueType === "SEXUAL_HARASSMENT") {
      destinationNumber = process.env.POLICE_NUMBER;
    } else if (issueType === "DOMESTIC_VIOLENCE") {
      destinationNumber = process.env.HEALTHCARE_NUMBER;
    } else {
      destinationNumber = process.env.OTHER_NUMBER;
    }

    // Options for Africa's Talking call initiation
    const options = {
      callFrom: process.env.AT_CALL_FROM, // Your registered caller ID
      callTo: destinationNumber,
    };

    // Wrap the callback-based API in a promise
    const atResponse = await new Promise((resolve, reject) => {
      voice.call(options, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    console.log("Africa's Talking Response:", atResponse);

    // Record the emergency call in your database
    const emergencyCall = await prisma.emergencyCall.create({
      data: {
        phoneNumber,
        issueType,
        redirectedTo: destinationNumber,
      },
    });

    return res.status(200).json({
      message: "Emergency call initiated successfully",
      atResponse,
      emergencyCall,
    });
  } catch (error) {
    console.error("Emergency Call Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
