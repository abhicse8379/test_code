import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function AdminEventForm() {
  const [form, setForm] = useState({
    title: "", description: "", event_date: "", venue: "", registration_deadline: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/events", form);
      navigate(`/events/${data.event_id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Could not create event");
    }
  }

  return (
    <div className="form-page">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={update("title")} required />
        <textarea placeholder="Description" value={form.description} onChange={update("description")} />
        <label>Event Date &amp; Time
          <input type="datetime-local" value={form.event_date} onChange={update("event_date")} required />
        </label>
        <input placeholder="Venue" value={form.venue} onChange={update("venue")} />
        <label>Registration Deadline
          <input type="datetime-local" value={form.registration_deadline} onChange={update("registration_deadline")} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
