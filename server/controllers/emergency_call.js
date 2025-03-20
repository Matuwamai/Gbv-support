import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
const EMERGENCY_ROUTES = {
  SEXUAL_HARASSMENT: "+15102413544", 
  DOMESTIC_VIOLENCE: "+15102413544", 
  OTHER: "+15102413544", 
};

export const makeEmergencyCall = async (req, res) => {
  try {
    const { phoneNumber, issueType } = req.body;
    if (!phoneNumber || !issueType) {
      return res.status(400).json({ error: "Phone number and issue type are required" });
    }
    if (!EMERGENCY_ROUTES[issueType]) {
      return res.status(400).json({ error: "Invalid issue type" });
    }

    const sanitizedPhoneNumber = `+${phoneNumber.replace(/\D/g, "")}`;
    const emergencyContact = EMERGENCY_ROUTES[issueType];

    console.log(`Calling from: ${twilioPhoneNumber} to: ${sanitizedPhoneNumber} for issue: ${issueType}`);
    const call = await client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
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
