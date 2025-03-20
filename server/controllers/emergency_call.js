import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Predefined emergency numbers for different issue types
const EMERGENCY_ROUTES = {
  SEXUAL_HARASSMENT: "+15102413544", // Replace with the actual support line
  DOMESTIC_VIOLENCE: "+15102413544", // Replace with the actual support line
  OTHER: "+15102413544", // Generic support line
};

export const makeEmergencyCall = async (req, res) => {
  try {
    const { phoneNumber, issueType } = req.body;

    // Validate input
    if (!phoneNumber || !issueType) {
      return res.status(400).json({ error: "Phone number and issue type are required" });
    }

    // Check if issueType is valid
    if (!EMERGENCY_ROUTES[issueType]) {
      return res.status(400).json({ error: "Invalid issue type" });
    }

    const sanitizedPhoneNumber = `+${phoneNumber.replace(/\D/g, "")}`;
    const emergencyContact = EMERGENCY_ROUTES[issueType];

    console.log(`Calling from: ${twilioPhoneNumber} to: ${sanitizedPhoneNumber} for issue: ${issueType}`);

    // Initiate Twilio call
    const call = await client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml", // Change to a custom TwiML Bin URL
      to: emergencyContact,
      from: twilioPhoneNumber,
    });

    return res.status(200).json({ 
      message: `Emergency call initiated to ${issueType} support line`, 
      callSid: call.sid 
    });

  } catch (error) {
    console.error("Twilio Call Error:", error);
    return res.status(500).json({ error: "Failed to make a call", details: error.message });
  }
};
