const express = require("express");
const pool = require("../db/pool");
const { verifyAdmin, verifyStudent } = require("../middleware/auth");

const router = express.Router();

// FR-7: public event list (any logged-in user)
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT event_id, title, description, event_date, venue, registration_deadline, status
       FROM events WHERE status != 'draft' ORDER BY event_date DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM events WHERE event_id = $1", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Event not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// FR-5: create event (admin only)
router.post("/", verifyAdmin, async (req, res, next) => {
  try {
    const { title, description, event_date, venue, registration_deadline, certificate_template_id } = req.body;
    if (!title || !event_date) {
      return res.status(400).json({ error: "title and event_date are required" });
    }
    const { rows } = await pool.query(
      `INSERT INTO events (title, description, event_date, venue, registration_deadline, certificate_template_id, created_by_admin_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, description || null, event_date, venue || null, registration_deadline || null, certificate_template_id || null, req.adminId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// FR-6: edit / cancel event (admin only)
router.put("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const { title, description, event_date, venue, registration_deadline, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE events SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         event_date = COALESCE($3, event_date),
         venue = COALESCE($4, venue),
         registration_deadline = COALESCE($5, registration_deadline),
         status = COALESCE($6, status)
       WHERE event_id = $7 RETURNING *`,
      [title, description, event_date, venue, registration_deadline, status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Event not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
