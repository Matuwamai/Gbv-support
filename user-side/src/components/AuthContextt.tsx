import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";


// Define user type
interface User {
  id: number;
  name: string;
  email: string;
//   profilePhoto?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ id: decoded.userId, name: decoded.name, email: decoded.email });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // Remove corrupted token
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: any = jwtDecode(token);
    setUser({ id: decoded.userId, name: decoded.name, email: decoded.email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
