import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import QRScanner from "../components/QRScanner";

export default function AdminScanner() {
  const { id } = useParams();
  const [lastResult, setLastResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleScan(token) {
    if (busy) return; // avoid firing multiple requests for the same frame burst
    setBusy(true);
    try {
      const { data } = await api.post("/attendance/scan", { qr_code_token: token });
      setLastResult({ type: "success", message: `Checked in: ${data.student_id}` });
    } catch (err) {
      const msg = err.response?.data?.error || "Scan failed";
      setLastResult({ type: "error", message: msg });
    } finally {
      setTimeout(() => setBusy(false), 1500); // brief cooldown so the same badge isn't re-scanned instantly
    }
  }

  return (
    <div className="page centered">
      <h2>Attendance Scanner</h2>
      <p className="hint">Event ID: {id}</p>
      <QRScanner onScan={handleScan} />
      {lastResult && (
        <p className={lastResult.type === "success" ? "success" : "error"}>{lastResult.message}</p>
      )}
    </div>
  );
}
