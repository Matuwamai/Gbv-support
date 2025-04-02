import { useState } from "react";
import axios from "axios";
import emergencyImage from "../assets/emergency-call-vector.webp"; // Ensure you have an image

const EmergencyPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [issueType, setIssueType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const API_BASE_URL = "http://localhost:3000/api";

  const handleCall = async () => {
    if (!phoneNumber || !issueType) {
      setMessage("Please enter your phone number and select an issue.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/calls/call`, {
        phoneNumber,
        issueType,
      });

      setMessage(response.data.message || "Call initiated successfully!");
    } catch (error) {
      setMessage("Failed to initiate call. Please try again.");
      console.error("Call Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen mt-12 bg-purple-600 ">
      {/* Left Section: Image */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center">
        <img src={emergencyImage} alt="Emergency Call" className="w-full h-full object-cover rounded-lg shadow-lg" />
      </div>

      {/* Right Section: Explanation */}
      <div className="w-full md:w-1/2 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Emergency Support Center</h2>
        <p className="text-lg mb-4 text-purple-600 font-semibold">
          If you are facing an emergency related to gender-based violence, we are here to help. Our emergency call
          system will connect you with the appropriate authorities, whether it's law enforcement, medical assistance,
          or counseling services.
        </p>
        <p className="text-lg mb-4">
          <strong className="text-purple-700">How it works:</strong>
        </p>
        <div className="text-lg mb-6">
          <ul className="ml-6 space-y-2">
            <li className="flex items-center gap-2 font-bold ">
              <span className="text-purple-600 font-bold text-4xl">›</span>
              Enter your phone number.
            </li>
            <li className="flex items-center gap-2 font-bold">
              <span className="text-purple-600 font-bold text-4xl">›</span>
              Select the type of issue you are experiencing.
            </li>
            <li className="flex items-center gap-2 font-bold">
              <span className="text-purple-600 font-bold text-4xl">›</span>
              Click "Call Now" to get immediate help.
            </li>
            <li className="flex items-center gap-2 font-bold">
              <span className="text-purple-600 font-bold text-4xl">›</span>
              You will be connected to the appropriate emergency service.
            </li>
          </ul>
        </div>
        <p className="text-lg font-bold text-purple-700">
          Your safety is our priority. Do not hesitate to reach out for support.
        </p>
        <div className="mt-6 w-full max-w-md bg-purple-900 p-6 rounded-lg shadow-lg  m-auto">
          <h2 className="text-xl font-bold text-white mb-4">Need Immediate Help?</h2>
          <input
            type="number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 bg-gray-100 text-gray-700"
          />
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 bg-gray-100 text-gray-700"
          >
            <option value="">Select Issue Type</option>
            <option value="SEXUAL_HARASSMENT">Sexual Harassment</option>
            <option value="DOMESTIC_VIOLENCE">Domestic Violence</option>
            <option value="OTHER">Other</option>
          </select>
          <button
            onClick={handleCall}
            className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-800 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Calling..." : "Call Now"}
          </button>
          {message && <p className="mt-4 text-red-400">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;