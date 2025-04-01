import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  
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

  const API_BASE_URL  = "http://localhost:3000/api"
const [loading, setLoading] = useState(true);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.day || !formData.month || !formData.year) {
      alert("Please select a valid birthday.");
      return;
    }

    const birthday = `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`;

    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      birthday, 
      Gender: formData.gender,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (response.ok) {
        navigate("/login");
      } else {
        alert(data?.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please check your internet connection and try again.");
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <h1 className="mb-4 text-2xl text-purple-600 font-bold text-center">
        Gender-Based Violence 
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center text-purple-600 mb-4">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              className="w-full sm:w-1/2 p-2 border rounded"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="w-full sm:w-1/2 p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Birthday</label>
            <div className="flex gap-2">
              <select name="day" onChange={handleChange} className="w-1/3 p-2 border rounded" required>
                <option value="">Day</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                ))}
              </select>
              <select name="month" onChange={handleChange} className="w-1/3 p-2 border rounded" required>
                <option value="">Month</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                  <option key={i} value={String(i + 1)}>{m}</option>
                ))}
              </select>
              <select name="year" onChange={handleChange} className="w-1/3 p-2 border rounded" required>
                <option value="">Year</option>
                {[...Array(100)].map((_, i) => (
                  <option key={i} value={String(2025 - i)}>{2025 - i}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Gender</label>
            <div className="flex gap-4">
              <label><input type="radio" name="gender" value="Male" onChange={handleChange} required /> Male</label>
              <label><input type="radio" name="gender" value="Female" onChange={handleChange} required /> Female</label>
              <label><input type="radio" name="gender" value="Others" onChange={handleChange} required /> Others</label>
            </div>
          </div>

          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />

          {loading ? (<button type="submit" className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition duration-300">
            Sign Up
          </button>):(<button
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition duration-300"
          >Creating Account ....</button>)}
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-purple-700 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
