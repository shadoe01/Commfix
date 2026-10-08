const multer = require("multer");
const crypto = require("crypto");
const { UPLOAD_DIR } = require("../utils/imageFiles");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB -- matches the frontend check in utils/imageRules.js

// The saved file's extension comes from the validated MIME type, NOT from
// the filename the client sent. Using the client's filename would let
// someone upload "x.html" labelled as image/jpeg and have it stored (and
// later served) as HTML.
const EXTENSIONS = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${EXTENSIONS[file.mimetype]}`),
});

// First-pass check on the MIME type the browser reported. This can be
// faked, so reportController.uploadImage ALSO checks the file's real bytes.
function fileFilter(req, file, cb) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    const err = new Error("This file isn't a supported image. Please choose a JPEG, PNG, or WebP image.");
    err.status = 400;
    return cb(err);
  }
  cb(null, true);
}

module.exports = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE, files: 1 } });
