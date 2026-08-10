const express = require("express");
const pool = require("../db/pool");
const { verifyStudent, verifyAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { generateQrToken } = require("../utils/qrToken");
const { parseStudentIdsFromCsv } = require("../utils/csvParser");

const router = express.Router({ mergeParams: true });

// FR-8: student self-registration. Unique (student_id, event_id) constraint in schema
// is the real enforcement (NFR-3) — this returns a friendly 409 via errorHandler on conflict.
router.post("/:eventId/register", verifyStudent, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const token = generateQrToken();
    const { rows } = await client.query(
      `INSERT INTO registrations (student_id, event_id, registered_via, qr_code_token)
       VALUES ($1,$2,'self',$3) RETURNING registration_id`,
      [req.studentId, req.params.eventId, token]
    );
    await client.query(`INSERT INTO attendance (registration_id, status) VALUES ($1, 'absent')`, [
      rows[0].registration_id,
    ]);
    await client.query("COMMIT");
    res.status(201).json({ message: "Registered", qr_code_token: token });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});

// FR-9: admin bulk registration via CSV. Duplicates (student already registered for
// this event) are silently skipped and counted, never overwritten — matches SRS decision.
router.post("/:eventId/bulk-register", verifyAdmin, upload.single("file"), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: "CSV file is required (field name: file)" });

  try {
    const studentIds = parseStudentIdsFromCsv(req.file.buffer);
    let registered = 0;
    let skipped = 0;
    const unknownStudentIds = [];

    for (const studentId of studentIds) {
      const studentExists = await pool.query("SELECT 1 FROM students WHERE student_id = $1", [studentId]);
      if (studentExists.rowCount === 0) {
        unknownStudentIds.push(studentId);
        continue;
      }

      const token = generateQrToken();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query(
          `INSERT INTO registrations (student_id, event_id, registered_via, qr_code_token)
           VALUES ($1,$2,'bulk_upload',$3)
           ON CONFLICT (student_id, event_id) DO NOTHING
           RETURNING registration_id`,
          [studentId, req.params.eventId, token]
        );
        if (result.rowCount === 0) {
          skipped++;
          await client.query("ROLLBACK");
        } else {
          await client.query(`INSERT INTO attendance (registration_id, status) VALUES ($1, 'absent')`, [
            result.rows[0].registration_id,
          ]);
          await client.query("COMMIT");
          registered++;
        }
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    }

    res.json({ registered, skipped_duplicates: skipped, unknown_student_ids: unknownStudentIds });
  } catch (err) {
    next(err);
  }
});

// FR-10: student retrieves their own QR token for an event
router.get("/:eventId/my-qr", verifyStudent, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT qr_code_token FROM registrations WHERE student_id = $1 AND event_id = $2`,
      [req.studentId, req.params.eventId]
    );
    if (!rows[0]) return res.status(404).json({ error: "Not registered for this event" });
    res.json({ qr_code_token: rows[0].qr_code_token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
