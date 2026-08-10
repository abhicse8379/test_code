require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const eventsRoutes = require("./routes/events.routes");
const registrationsRoutes = require("./routes/registrations.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const eventCertificatesRoutes = require("./routes/eventCertificates.routes");
const certificatesRoutes = require("./routes/certificates.routes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // required so the browser sends the httpOnly cookie
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);            // GET /, GET /:id, POST /, PUT /:id
app.use("/api/events", registrationsRoutes);      // POST /:eventId/register, /bulk-register, /my-qr
app.use("/api/events", eventCertificatesRoutes);  // POST /:eventId/generate-certificates
app.use("/api/attendance", attendanceRoutes);     // POST /scan, GET /:eventId/report
app.use("/api/certificates", certificatesRoutes); // GET /my, GET /new-count, GET /:id/download

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`EMS backend listening on port ${PORT}`));
