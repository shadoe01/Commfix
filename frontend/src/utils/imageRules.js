// One place for the photo rules, so the wizard and Report Details can't
// drift apart. The backend enforces the same limits again (middleware/
// upload.js, utils/imageFiles.js) -- client-side checks only exist to give
// faster, friendlier feedback and can always be bypassed.

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_IMAGES_PER_REPORT = 5;

// Returns an error message, or "" if the file is acceptable.
export function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "This file isn't a supported image. Please choose a JPEG, PNG, or WebP image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "This image is too large. Please choose a file under 5 MB.";
  }
  return "";
}
