const express = require("express");
const pool = require("../db/pool");
const { verifyAdmin } = require("../middleware/auth");

const router = express.Router();

// FR-11 + FR-12: scan a QR token. One-time consumption — a second scan of an
// already-present registration is rejected, not toggled back to absent.
router.post("/scan", verifyAdmin, async (req, res, next) => {
  try {
    const { qr_code_token } = req.body;
    if (!qr_code_token) return res.status(400).json({ error: "qr_code_token is required" });

    const regResult = await pool.query(
      `SELECT r.registration_id, r.student_id, r.event_id, a.status
       FROM registrations r JOIN attendance a ON a.registration_id = r.registration_id
       WHERE r.qr_code_token = $1`,
      [qr_code_token]
    );
    const reg = regResult.rows[0];
    if (!reg) return res.status(404).json({ error: "Invalid QR code — no matching registration" });

    if (reg.status === "present") {
      return res.status(409).json({ error: "Already checked in", student_id: reg.student_id });
    }

    await pool.query(
      `UPDATE attendance SET status = 'present', scanned_at = now(), scanned_by_admin_id = $1
       WHERE registration_id = $2`,
      [req.adminId, reg.registration_id]
    );

    res.json({ message: "Checked in", student_id: reg.student_id });
  } catch (err) {
    next(err);
  }
});

// FR-13: live attendance report for an event
router.get("/:eventId/report", verifyAdmin, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.student_id, s.name, a.status, a.scanned_at
       FROM registrations r
       JOIN students s ON s.student_id = r.student_id
       JOIN attendance a ON a.registration_id = r.registration_id
       WHERE r.event_id = $1
       ORDER BY s.name`,
      [req.params.eventId]
    );
    const present = rows.filter((r) => r.status === "present").length;
    res.json({ total: rows.length, present, absent: rows.length - present, attendees: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
