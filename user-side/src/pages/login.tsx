import React, { useState } from "react";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";

interface LoginLocationState {
  from?: { pathname?: string };
  registered?: boolean;
}

const Login: React.FC = () => {
  const { login, currentUser } = useAuth();
  const location = useLocation();
  const state = (location.state ?? {}) as LoginLocationState;
  const redirectTo = state.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    state.registered ? "Account created. Please log in." : null
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (currentUser && !loading && !success?.startsWith("Login")) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Input validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const response = await login({ email: email.trim(), password });
    setLoading(false);
    if (response) {
      setError(response);
    } else {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate(redirectTo, { replace: true }), 600);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center h-screen bg-gray-100 px-4">
      <h1 className="text-3xl mb-4 text-purple-600 font-bold text-center">
        Gender-Based Violence
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">Login</h2>

        {error && <p className="text-red-500 font-bold text-sm text-center mb-2" role="alert">{error}</p>}
        {success && <p className="text-green-500 font-bold text-sm text-center mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`p-2 rounded-lg text-white ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
