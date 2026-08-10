import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function AdminAttendance() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get(`/attendance/${id}/report`).then((res) => setReport(res.data));
  }, [id]);

  if (!report) return <p style={{ padding: 20 }}>Loading…</p>;

  return (
    <div className="page">
      <h2>Attendance Report</h2>
      <p>
        <strong>{report.present}</strong> present / <strong>{report.total}</strong> registered
        ({report.absent} absent)
      </p>
      <table className="table">
        <thead>
          <tr><th>Student ID</th><th>Name</th><th>Status</th><th>Scanned At</th></tr>
        </thead>
        <tbody>
          {report.attendees.map((a) => (
            <tr key={a.student_id}>
              <td>{a.student_id}</td>
              <td>{a.name}</td>
              <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
              <td>{a.scanned_at ? new Date(a.scanned_at).toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
