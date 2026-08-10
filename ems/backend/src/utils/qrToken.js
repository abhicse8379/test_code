const crypto = require("crypto");

// NFR-2: cryptographically random, unique per registration, not derived from event_id.
function generateQrToken() {
  return crypto.randomBytes(24).toString("hex"); // 48 hex chars
}

module.exports = { generateQrToken };
