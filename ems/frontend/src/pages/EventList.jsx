import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading events…</p>;

  return (
    <div className="page">
      <h2>Events</h2>
      {events.length === 0 && <p>No events published yet.</p>}
      <div className="card-grid">
        {events.map((ev) => (
          <Link to={`/events/${ev.event_id}`} className="card" key={ev.event_id}>
            <h3>{ev.title}</h3>
            <p>{new Date(ev.event_date).toLocaleString()}</p>
            <p>{ev.venue}</p>
            <span className={`badge badge-${ev.status}`}>{ev.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
