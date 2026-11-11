import { useState, ChangeEvent, FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../context/auth";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const MIN_PASSWORD_LENGTH = 6;

const SignUp = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { day, month, year, password, email } = formData;
    if (!day || !month || !year) return "Please select a valid birthday.";

    // Reject impossible dates such as 31 February.
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (date.getMonth() !== Number(month) - 1) return "That date does not exist.";
    if (date > new Date()) return "Birthday cannot be in the future.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Please enter a valid email.";
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (!formData.gender) return "Please select your gender.";
    return "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    const birthday = `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`;

    setLoading(true);
    try {
      await api.post("/users/register", {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        birthday,
        gender: formData.gender,
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(getErrorMessage(err, "Signup failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <h1 className="mb-4 text-2xl text-purple-600 font-bold text-center">Gender-Based Violence</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center text-purple-600 mb-4">Create Account</h2>
        {error && (
          <p className="text-red-500 font-bold text-sm text-center mb-3" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              aria-label="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full sm:w-1/2 p-2 border rounded"
              autoComplete="given-name"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              aria-label="Last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full sm:w-1/2 p-2 border rounded"
              autoComplete="family-name"
              required
            />
          </div>

          <fieldset>
            <legend className="block text-gray-700">Birthday</legend>
            <div className="flex gap-2">
              <select name="day" aria-label="Day" value={formData.day} onChange={handleChange} className="w-1/3 p-2 border rounded" required>
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select name="month" aria-label="Month" value={formData.month} onChange={handleChange} className="w-1/3 p-2 border rounded" required>
                <option value="">Month</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={String(i + 1)}>
                    {m}
                  </option>
                ))}
              </select>
              <select name="year" aria-label="Year" value={formData.year} onChange={handleChange} className="w-1/3 p-2 border rounded" required>
                <option value="">Year</option>
                {YEARS.map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-gray-700">Gender</legend>
            <div className="flex gap-4">
              {[
                ["MALE", "Male"],
                ["FEMALE", "Female"],
                ["OTHER", "Other"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={formData.gender === value}
                    onChange={handleChange}
                    required
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            autoComplete="email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder={`Password (at least ${MIN_PASSWORD_LENGTH} characters)`}
            aria-label="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition duration-300 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
