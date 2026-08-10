import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => setEvent(res.data));
  }, [id]);

  async function handleRegister() {
    setError("");
    setMessage("");
    try {
      await api.post(`/events/${id}/register`);
      setMessage("Registered! View your QR code under 'My QR' from the events list.");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  if (!event) return <p style={{ padding: 20 }}>Loading…</p>;

  return (
    <div className="page">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>When:</strong> {new Date(event.event_date).toLocaleString()}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      {event.registration_deadline && (
        <p><strong>Register by:</strong> {new Date(event.registration_deadline).toLocaleString()}</p>
      )}

      {user?.role === "student" && (
        <>
          <button onClick={handleRegister}>Register for this event</button>
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
          <p><Link to={`/events/${id}/my-qr`}>View my QR code for this event</Link></p>
        </>
      )}

      {user?.role === "admin" && (
        <div className="admin-actions">
          <Link to={`/admin/events/${id}/bulk-upload`}><button>Bulk Upload Registrants</button></Link>
          <Link to={`/admin/events/${id}/scanner`}><button>Open Scanner</button></Link>
          <Link to={`/admin/events/${id}/attendance`}><button>View Attendance</button></Link>
        </div>
      )}
    </div>
  );
}
