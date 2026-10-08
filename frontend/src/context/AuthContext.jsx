import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/api.js";

const AuthContext = createContext(null);

// Storing the token in localStorage is the simplest approach for a
// prototype. Worth knowing: localStorage is readable by any JavaScript
// running on the page, so it's vulnerable to XSS (a malicious script
// could steal the token). A production system would typically use an
// httpOnly cookie instead, which JavaScript can't read at all. That's a
// larger backend change (cookie-based sessions instead of a bearer token
// the frontend attaches itself) -- worth revisiting before this becomes a
// real public system, not required for the prototype.
const STORAGE_KEY = "commfix_auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null); // { token, user } | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAuth(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await api.login(email, password); // throws on failure
    setAuth(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data.user;
  }

  async function register(payload) {
    return api.register(payload); // registration does not log the user in automatically
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: !!auth?.token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
