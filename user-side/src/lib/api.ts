import axios, { AxiosError } from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(
  /\/+$/,
  ""
);

export const AUTH_STORAGE_KEY = "user";
export const AUTH_EXPIRED_EVENT = "auth:expired";

const api = axios.create({ baseURL: API_BASE_URL });

export const getStoredToken = (): string | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? (JSON.parse(stored).token ?? null) : null;
  } catch {
    return null;
  }
};

// Attach the logged-in user's token to every request.
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// An expired or invalid token means the session is over; let the auth context log out.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && getStoredToken()) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

// Pull a human-readable message out of an API error.
export const getErrorMessage = (error: unknown, fallback = "Something went wrong. Please try again.") => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    if (data?.message || data?.error) return (data.message || data.error) as string;
    if (!error.response) return "Cannot reach the server. Check your connection and try again.";
  }
  return fallback;
};

export default api;
