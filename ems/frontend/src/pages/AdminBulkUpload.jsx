import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function AdminBulkUpload() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!file) return setError("Choose a CSV file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post(`/events/${id}/bulk-register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    }
  }

  return (
    <div className="form-page">
      <h2>Bulk Upload Registrants</h2>
      <p className="hint">CSV must have a header row with a column named <code>student_id</code>.</p>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Upload</button>
      </form>
      {result && (
        <div className="result-box">
          <p><strong>Registered:</strong> {result.registered}</p>
          <p><strong>Skipped (already registered):</strong> {result.skipped_duplicates}</p>
          {result.unknown_student_ids?.length > 0 && (
            <p><strong>Unknown student IDs (no account yet):</strong> {result.unknown_student_ids.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}
