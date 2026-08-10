const jwt = require("jsonwebtoken");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function readTokenFromCookie(req) {
  return req.cookies ? req.cookies.token : null;
}

// Verifies the JWT and ensures role === 'student'
function verifyStudent(req, res, next) {
  const token = readTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "student") {
      return res.status(403).json({ error: "Student access only" });
    }
    req.studentId = decoded.studentId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

// Verifies the JWT and ensures role === 'admin'
function verifyAdmin(req, res, next) {
  const token = readTokenFromCookie(req);
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access only" });
    }
    req.adminId = decoded.adminId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

const COOKIE_OPTIONS = {
  httpOnly: true, // NFR-1: never accessible to client-side JS (XSS mitigation)
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

module.exports = { signToken, verifyStudent, verifyAdmin, COOKIE_OPTIONS };
