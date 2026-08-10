import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function StudentRegister() {
  const [form, setForm] = useState({ student_id: "", name: "", email: "", department: "", year: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/student/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="form-page">
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Student ID" value={form.student_id} onChange={update("student_id")} required />
        <input placeholder="Full Name" value={form.name} onChange={update("name")} required />
        <input placeholder="Email" type="email" value={form.email} onChange={update("email")} required />
        <input placeholder="Department" value={form.department} onChange={update("department")} />
        <input placeholder="Year" type="number" value={form.year} onChange={update("year")} />
        <input placeholder="Password" type="password" value={form.password} onChange={update("password")} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Create Account</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
