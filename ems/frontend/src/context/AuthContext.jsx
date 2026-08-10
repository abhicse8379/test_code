import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { role: 'student'|'admin', ...profile }
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    // Try student session, then admin session. Neither existing is a normal logged-out state.
    try {
      const { data } = await api.get("/auth/me/student");
      setUser({ role: "student", ...data });
      setLoading(false);
      return;
    } catch {
      /* not a student session */
    }
    try {
      const { data } = await api.get("/auth/me/admin");
      setUser({ role: "admin", ...data });
    } catch {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
