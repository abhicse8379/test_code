const multer = require("multer");

// In-memory storage: files are small (CSV lists), no need to touch disk.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
});

module.exports = upload;
