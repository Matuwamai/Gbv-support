import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../context/authContext";

const Login = () => {
  const navigate = useNavigate();
  const authContext = useContext(Authcontext);

  if (!authContext) {
    console.error("AuthContext is not available! Ensure AuthContextProvider is wrapping the app.");
    return <div>Error: AuthContext is missing</div>;
  }

  const { login } = authContext; // ✅ Ensure context exists before using login

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData);
      console.log("Login successful! Redirecting...");
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-semibold mb-4 text-purple-600 font-bold text-center">
        Gender-Based Violence Support
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4 text-orange-600">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-orange-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
