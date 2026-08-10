import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function AdminCertificates() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleGenerate() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const { data } = await api.post(`/events/${id}/generate-certificates`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <h2>Generate Certificates</h2>
      <p className="hint">
        Only registrants marked present will receive a certificate. Safe to click more than
        once — already-generated certificates are skipped, not duplicated.
      </p>
      <button onClick={handleGenerate} disabled={busy}>
        {busy ? "Generating…" : "Generate Certificates"}
      </button>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result-box">
          <p><strong>Generated:</strong> {result.generated}</p>
          <p><strong>Skipped (absent or already had one):</strong> {result.already_had_certificate_or_absent}</p>
          {result.failures?.length > 0 && (
            <div className="error">
              <p>Failures:</p>
              <ul>{result.failures.map((f) => <li key={f.student_id}>{f.student_id}: {f.error}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
