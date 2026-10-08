const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Identifies the REAL image format from the file's first bytes ("magic
// numbers"), ignoring whatever MIME type or filename the client claimed.
// A text file renamed to .jpg fails this check.
function detectImageType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  return null;
}

// Fingerprint of the file's contents -- used to detect the same photo being
// attached to the same report twice (e.g. a retry after a flaky connection).
function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// Deletes a file, ignoring "already gone". Used to clean up uploads that
// multer saved to disk but we then rejected, so rejected uploads never
// leave orphan files behind.
async function removeFileQuietly(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") console.error("Could not delete file:", filePath, err.message);
  }
}

module.exports = { UPLOAD_DIR, detectImageType, sha256, removeFileQuietly };
