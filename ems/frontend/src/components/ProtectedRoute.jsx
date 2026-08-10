import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// role: 'student' | 'admin'
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
  if (!user || user.role !== role) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  }
  return children;
}
