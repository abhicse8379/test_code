import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">EMS</Link>
      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login">Student Login</Link>
            <Link to="/admin/login">Admin Login</Link>
          </>
        )}
        {user?.role === "student" && (
          <>
            <Link to="/events">Events</Link>
            <Link to="/certificates">My Certificates</Link>
            <button onClick={handleLogout}>Logout ({user.name})</button>
          </>
        )}
        {user?.role === "admin" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <button onClick={handleLogout}>Logout ({user.name})</button>
          </>
        )}
      </div>
    </nav>
  );
}
