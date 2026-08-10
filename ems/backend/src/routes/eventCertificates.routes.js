const express = require("express");
const pool = require("../db/pool");
const { verifyAdmin } = require("../middleware/auth");
const { generateCertificate } = require("../utils/certificateGenerator");
const { uploadPdfBuffer } = require("../utils/cloudinary");

const router = express.Router();

// FR-14 + FR-16: manual trigger, idempotent — only registrations that are present
// AND don't already have a certificate get generated. Safe to click twice.
router.post("/:eventId/generate-certificates", verifyAdmin, async (req, res, next) => {
  try {
    const eventResult = await pool.query("SELECT * FROM events WHERE event_id = $1", [req.params.eventId]);
    const event = eventResult.rows[0];
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (!event.certificate_template_id) {
      return res.status(400).json({ error: "This event has no certificate template assigned" });
    }

    const templateResult = await pool.query("SELECT * FROM certificate_templates WHERE template_id = $1", [
      event.certificate_template_id,
    ]);
    const template = templateResult.rows[0];

    const eligible = await pool.query(
      `SELECT r.registration_id, r.student_id, s.name AS student_name
       FROM registrations r
       JOIN attendance a ON a.registration_id = r.registration_id
       JOIN students s ON s.student_id = r.student_id
       LEFT JOIN certificates c ON c.registration_id = r.registration_id
       WHERE r.event_id = $1 AND a.status = 'present' AND c.generated_at IS NULL`,
      [req.params.eventId]
    );

    let generated = 0;
    const failures = [];

    for (const row of eligible.rows) {
      try {
        const pdfBuffer = await generateCertificate(template, {
          studentName: row.student_name,
          eventTitle: event.title,
          eventDate: new Date(event.event_date).toLocaleDateString(),
        });

        const url = await uploadPdfBuffer(pdfBuffer, `${event.event_id}_${row.student_id}`);

        await pool.query(
          `INSERT INTO certificates (registration_id, certificate_url, generated_at)
           VALUES ($1, $2, now())
           ON CONFLICT (registration_id) DO UPDATE SET certificate_url = $2, generated_at = now()`,
          [row.registration_id, url]
        );
        generated++;
      } catch (e) {
        failures.push({ student_id: row.student_id, error: e.message });
      }
    }

    res.json({ generated, already_had_certificate_or_absent: eligible.rows.length - generated, failures });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
