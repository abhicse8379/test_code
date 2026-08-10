import { useEffect, useState } from "react";
import api from "../api/client";

export default function MyCertificates() {
  const [certs, setCerts] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/certificates/my"), api.get("/certificates/new-count")])
      .then(([certsRes, newRes]) => {
        setCerts(certsRes.data);
        setNewCount(newRes.data.new_certificates);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;

  return (
    <div className="page">
      <h2>My Certificates {newCount > 0 && <span className="badge badge-new">{newCount} new</span>}</h2>
      {certs.length === 0 && <p>No certificates yet. They appear here after an event ends and attendance is confirmed.</p>}
      <div className="card-grid">
        {certs.map((c) => (
          <div className="card" key={c.certificate_id}>
            <h3>{c.event_title}</h3>
            <p>{new Date(c.event_date).toLocaleDateString()}</p>
            <a href={`${api.defaults.baseURL}/certificates/${c.certificate_id}/download`} target="_blank" rel="noreferrer">
              <button>Download</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
