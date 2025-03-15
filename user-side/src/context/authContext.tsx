import { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Define the type for the auth context
interface AuthContextType {
  currentUser: { id: string; fullName: string; token: string } | null;
  login: (inputs: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

// Create the Auth context
export const Authcontext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );

  // Login function
  const login = async (inputs: { email: string; password: string }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", inputs);

      console.log("Login Response:", res.data); // Debugging

      const decodedToken: any = jwtDecode(res.data.token); // Decode JWT

      console.log("Decoded Token:", decodedToken); // Debugging

      // Ensure backend sends `user` object
      const userData = {
        id: res.data.user.id, // ✅ Corrected
        name: res.data.user.name, // ✅ Ensure backend sends `fullName`
        token: res.data.token,
      };

      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  // Logout function
  const logout = async () => {
    await axios.post("http://localhost:5000/api/users/logout");
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // Ensure user data persists across refreshes
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Authcontext.Provider value={{ currentUser, login, logout }}>
      {children}
    </Authcontext.Provider>
  );
};
