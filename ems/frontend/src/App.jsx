import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import AdminLogin from "./pages/AdminLogin";
import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import MyQR from "./pages/MyQR";
import MyCertificates from "./pages/MyCertificates";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEventForm from "./pages/AdminEventForm";
import AdminBulkUpload from "./pages/AdminBulkUpload";
import AdminScanner from "./pages/AdminScanner";
import AdminAttendance from "./pages/AdminAttendance";
import AdminCertificates from "./pages/AdminCertificates";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/register" element={<StudentRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route
            path="/events/:id/my-qr"
            element={<ProtectedRoute role="student"><MyQR /></ProtectedRoute>}
          />
          <Route
            path="/certificates"
            element={<ProtectedRoute role="student"><MyCertificates /></ProtectedRoute>}
          />

          <Route
            path="/admin"
            element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/events/new"
            element={<ProtectedRoute role="admin"><AdminEventForm /></ProtectedRoute>}
          />
          <Route
            path="/admin/events/:id/bulk-upload"
            element={<ProtectedRoute role="admin"><AdminBulkUpload /></ProtectedRoute>}
          />
          <Route
            path="/admin/events/:id/scanner"
            element={<ProtectedRoute role="admin"><AdminScanner /></ProtectedRoute>}
          />
          <Route
            path="/admin/events/:id/attendance"
            element={<ProtectedRoute role="admin"><AdminAttendance /></ProtectedRoute>}
          />
          <Route
            path="/admin/events/:id/certificates"
            element={<ProtectedRoute role="admin"><AdminCertificates /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
