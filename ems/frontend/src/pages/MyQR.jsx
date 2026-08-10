import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

// Renders the QR token as a scannable image using a public QR image API —
// no extra frontend QR-generation library needed for v1.
export default function MyQR() {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/events/${id}/my-qr`)
      .then((res) => setToken(res.data.qr_code_token))
      .catch((err) => setError(err.response?.data?.error || "Could not load QR code"));
  }, [id]);

  if (error) return <p className="error" style={{ padding: 20 }}>{error}</p>;
  if (!token) return <p style={{ padding: 20 }}>Loading…</p>;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(token)}`;

  return (
    <div className="page centered">
      <h2>Your Check-In QR Code</h2>
      <img src={qrImageUrl} alt="Your event QR code" />
      <p className="hint">Show this at the venue entrance. It can only be scanned once.</p>
    </div>
  );
}
