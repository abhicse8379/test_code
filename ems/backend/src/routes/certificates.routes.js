const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("../db/pool");
const { verifyStudent } = require("../middleware/auth");

const router = express.Router();

// FR-18: student's own certificates
router.get("/my", verifyStudent, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.certificate_id, c.certificate_url, c.generated_at, e.title AS event_title, e.event_date
       FROM certificates c
       JOIN registrations r ON r.registration_id = c.registration_id
       JOIN events e ON e.event_id = r.event_id
       WHERE r.student_id = $1 AND c.generated_at IS NOT NULL
       ORDER BY c.generated_at DESC`,
      [req.studentId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// FR-19: in-app badge — count of certificates generated since this student's last login
router.get("/new-count", verifyStudent, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*) FROM certificates c
       JOIN registrations r ON r.registration_id = c.registration_id
       JOIN students s ON s.student_id = r.student_id
       WHERE r.student_id = $1 AND c.generated_at > COALESCE(s.last_login_at, 'epoch')`,
      [req.studentId]
    );
    res.json({ new_certificates: parseInt(rows[0].count, 10) });
  } catch (err) {
    next(err);
  }
});

router.get("/files/:filename", async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, "..", "uploads", "certificates", req.params.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Certificate file not found" });
    }
    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/download", verifyStudent, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.certificate_url FROM certificates c
       JOIN registrations r ON r.registration_id = c.registration_id
       WHERE c.certificate_id = $1 AND r.student_id = $2`,
      [req.params.id, req.studentId]
    );
    if (!rows[0]) return res.status(404).json({ error: "Certificate not found" });
    res.redirect(rows[0].certificate_url);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
