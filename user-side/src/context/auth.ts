import { createContext, useContext } from "react";

export interface CurrentUser {
  id: number;
  name: string;
  token: string;
}

export interface AuthContextType {
  currentUser: CurrentUser | null;
  /** Resolves to null on success, or an error message. */
  login: (inputs: { email: string; password: string }) => Promise<string | null>;
  logout: () => Promise<void>;
}

export const Authcontext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(Authcontext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
