import { useCallback, useEffect, useMemo, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import api, { AUTH_EXPIRED_EVENT, AUTH_STORAGE_KEY, getErrorMessage } from "../lib/api";
import { Authcontext, CurrentUser } from "./auth";

const isTokenExpired = (token: string) => {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    return typeof exp === "number" && exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

// Restore a saved session, discarding it if it is malformed or expired.
const loadStoredUser = (): CurrentUser | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    const user = JSON.parse(stored) as CurrentUser;
    if (!user?.token || isTokenExpired(user.token)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return user;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(loadStoredUser);

  const clearSession = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const login = useCallback(async (inputs: { email: string; password: string }) => {
    try {
      const res = await api.post("/users/login", inputs);
      const userData: CurrentUser = {
        id: res.data.user.id,
        name: res.data.user.name,
        token: res.data.token,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setCurrentUser(userData);
      return null;
    } catch (error) {
      return getErrorMessage(error, "Login failed. Please try again.");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/users/logout");
    } catch {
      // Logging out locally must work even if the server can't be reached.
    }
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    window.addEventListener(AUTH_EXPIRED_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, clearSession);
  }, [clearSession]);

  const value = useMemo(() => ({ currentUser, login, logout }), [currentUser, login, logout]);

  return <Authcontext.Provider value={value}>{children}</Authcontext.Provider>;
};
