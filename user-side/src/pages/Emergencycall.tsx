import { useState } from "react";
import axios from "axios";

const EmergencyPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [issueType, setIssueType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Emergency Call</h2>

      <input
        type="text"
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border p-2 rounded w-full max-w-md mb-2"
      />

      <select
        value={issueType}
        onChange={(e) => setIssueType(e.target.value)}
        className="border p-2 rounded w-full max-w-md mb-4"
      >
        <option value="">Select Issue Type</option>
        <option value="SEXUAL_HARASSMENT">Sexual Harassment</option>
        <option value="DOMESTIC_VIOLENCE">Domestic Violence</option>
        <option value="OTHER">Other</option>
      </select>

      <button
        onClick={handleCall}
        className="bg-red-600 text-white p-2 rounded w-full max-w-md disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Calling..." : "Call Now"}
      </button>

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
};

export default EmergencyPage;
