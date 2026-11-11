import { useState, FormEvent } from "react";
import { Phone } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";
import emergencyImage from "../assets/emergency-call-vector.webp";

// Free national hotlines in Kenya; shown so help is one tap away even if the call service is down.
const HOTLINES = [
  { name: "National GBV Hotline", number: "1195", note: "Free, 24/7" },
  { name: "Childline Kenya", number: "116", note: "Free, 24/7, for children" },
  { name: "Police Emergency", number: "999", note: "Or 112" },
];

const ISSUE_TYPES = [
  { value: "SEXUAL_HARASSMENT", label: "Sexual Harassment" },
  { value: "DOMESTIC_VIOLENCE", label: "Domestic Violence" },
  { value: "OTHER", label: "Other" },
];

const EmergencyPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [issueType, setIssueType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleCall = async (event: FormEvent) => {
    event.preventDefault();
    if (!phoneNumber.trim() || !issueType) {
      setResult({ type: "error", text: "Please enter your phone number and select an issue." });
      return;
    }
    if (!/^\+?[\d\s()-]{7,20}$/.test(phoneNumber.trim())) {
      setResult({ type: "error", text: "Please enter a valid phone number, e.g. 0712 345 678." });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await api.post("/calls/call", { phoneNumber: phoneNumber.trim(), issueType });
      setResult({ type: "success", text: response.data.message || "Call initiated successfully!" });
    } catch (error) {
      setResult({
        type: "error",
        text: getErrorMessage(error, "Failed to initiate call. Please call one of the hotlines below."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center min-h-screen mt-12 bg-purple-600">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <img src={emergencyImage} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="w-full md:w-1/2 p-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Emergency Support Center</h2>
        <p className="text-lg mb-4 text-purple-600 font-semibold">
          If you are facing an emergency related to gender-based violence, we are here to help. Our emergency call
          system will connect you with the appropriate authorities, whether it's law enforcement, medical assistance,
          or counseling services.
        </p>

        <section className="mb-6 bg-white border-l-4 border-red-500 rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold text-red-600 mb-2">In immediate danger? Call now</h3>
          <ul className="grid gap-2 sm:grid-cols-3">
            {HOTLINES.map((line) => (
              <li key={line.number}>
                <a
                  href={`tel:${line.number}`}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-center"
                >
                  <span className="flex items-center gap-1 text-2xl font-bold">
                    <Phone size={18} /> {line.number}
                  </span>
                  <span className="text-sm font-semibold">{line.name}</span>
                  <span className="text-xs opacity-90">{line.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-lg mb-2">
          <strong className="text-purple-700">Or let us call you:</strong>
        </p>
        <ol className="ml-6 space-y-1 text-lg mb-6 list-decimal font-semibold text-gray-800">
          <li>Enter your phone number.</li>
          <li>Select the type of issue you are experiencing.</li>
          <li>Click "Call Now". We will ring your phone and connect you to a support line.</li>
        </ol>

        <form onSubmit={handleCall} className="w-full max-w-md bg-purple-900 p-6 rounded-lg shadow-lg m-auto">
          <h3 className="text-xl font-bold text-white mb-4">Need Immediate Help?</h3>
          <label htmlFor="emergency-phone" className="sr-only">
            Your phone number
          </label>
          <input
            id="emergency-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Your phone number, e.g. 0712 345 678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 bg-gray-100 text-gray-700"
          />
          <label htmlFor="emergency-issue" className="sr-only">
            Issue type
          </label>
          <select
            id="emergency-issue"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 bg-gray-100 text-gray-700"
          >
            <option value="">Select Issue Type</option>
            {ISSUE_TYPES.map((issue) => (
              <option key={issue.value} value={issue.value}>
                {issue.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-800 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Calling..." : "Call Now"}
          </button>
          {result && (
            <p className={`mt-4 ${result.type === "error" ? "text-red-300" : "text-green-300"}`} role="status">
              {result.text}
            </p>
          )}
        </form>

        <p className="text-lg font-bold text-purple-700 mt-6">
          Your safety is our priority. Do not hesitate to reach out for support.
        </p>
      </div>
    </div>
  );
};

export default EmergencyPage;
