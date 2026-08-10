const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const { signToken, COOKIE_OPTIONS, verifyStudent, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

// FR-1: Student account registration
router.post("/student/register", async (req, res, next) => {
  try {
    const { student_id, name, email, department, year, password } = req.body;
    if (!student_id || !name || !email || !password) {
      return res.status(400).json({ error: "student_id, name, email, and password are required" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO students (student_id, name, email, department, year, password_hash)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [student_id, name, email, department || null, year || null, password_hash]
    );
    res.status(201).json({ message: "Registered. You can now log in." });
  } catch (err) {
    next(err);
  }
});

// FR-2: Student login
router.post("/student/login", async (req, res, next) => {
  try {
    const { student_id, password } = req.body;
    const { rows } = await pool.query("SELECT * FROM students WHERE student_id = $1", [student_id]);
    const student = rows[0];
    if (!student || !(await bcrypt.compare(password, student.password_hash))) {
      return res.status(401).json({ error: "Invalid student ID or password" });
    }

    await pool.query("UPDATE students SET last_login_at = now() WHERE student_id = $1", [student_id]);

    const token = signToken({ role: "student", studentId: student.student_id });
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({ student_id: student.student_id, name: student.name });
  } catch (err) {
    next(err);
  }
});

// FR-3: Admin login (no public admin self-registration — seed admins directly in DB)
router.post("/admin/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = signToken({ role: "admin", adminId: admin.admin_id });
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({ admin_id: admin.admin_id, name: admin.name });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
});

router.get("/me/student", verifyStudent, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT student_id, name, email, department, year FROM students WHERE student_id = $1",
      [req.studentId]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get("/me/admin", verifyAdmin, async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT admin_id, name, email, role FROM admins WHERE admin_id = $1", [
      req.adminId,
    ]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
