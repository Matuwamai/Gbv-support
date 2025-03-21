import { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


interface AuthContextType {
  currentUser: { id: string; name: string; token: string } | null;
  login: (inputs: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}
const API_BASE_URL = `https://gbv-support.onrender.com`;
export const Authcontext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );

  const login = async (inputs: { email: string; password: string }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, inputs);

      console.log("Login Response:", res.data);

      const decodedToken: any = jwtDecode(res.data.token);

      console.log("Decoded Token:", decodedToken); 

      const userData = {
        id: res.data.user.id,
        name: res.data.user.name,
        token: res.data.token,
      };

      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = async () => {
    await axios.post(`${API_BASE_URL}/users/logout`);
    setCurrentUser(null);
    localStorage.removeItem("user");
  };
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
