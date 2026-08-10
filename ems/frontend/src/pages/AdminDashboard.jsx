import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <Link to="/admin/events/new"><button>+ New Event</button></Link>
      </div>
      <div className="card-grid">
        {events.map((ev) => (
          <div className="card" key={ev.event_id}>
            <h3>{ev.title}</h3>
            <p>{new Date(ev.event_date).toLocaleString()}</p>
            <div className="admin-actions">
              <Link to={`/admin/events/${ev.event_id}/bulk-upload`}>Bulk Upload</Link>
              <Link to={`/admin/events/${ev.event_id}/scanner`}>Scanner</Link>
              <Link to={`/admin/events/${ev.event_id}/attendance`}>Attendance</Link>
              <Link to={`/admin/events/${ev.event_id}/certificates`}>Certificates</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
