const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function buildLocalCertificateUrl(filename) {
  const baseUrl = process.env.BACKEND_URL || "http://localhost:4000";
  return `${baseUrl}/api/certificates/files/${filename}`;
}

function getLocalUploadPath(publicId) {
  const safeId = String(publicId).replace(/[^a-zA-Z0-9._-]/g, "_");
  const uploadDir = path.join(__dirname, "..", "uploads", "certificates");
  fs.mkdirSync(uploadDir, { recursive: true });
  return path.join(uploadDir, `${safeId}.pdf`);
}

// Uploads a PDF buffer and returns a URL. If Cloudinary is not configured, it writes
// the file locally so the certificate flow still works in development.
function uploadPdfBuffer(buffer, publicId) {
  const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
  );

  if (!hasCloudinaryConfig) {
    const localPath = getLocalUploadPath(publicId);
    fs.writeFileSync(localPath, buffer);
    return Promise.resolve(buildLocalCertificateUrl(path.basename(localPath)));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // PDFs are uploaded as raw files, not images
        public_id: publicId,
        folder: "certificates",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          const localPath = getLocalUploadPath(publicId);
          fs.writeFileSync(localPath, buffer);
          return resolve(buildLocalCertificateUrl(path.basename(localPath)));
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

module.exports = { uploadPdfBuffer };
