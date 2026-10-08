const { success, error } = require("../utils/apiResponse");
const reportModel = require("../models/reportModel");
const residentModel = require("../models/residentModel");
const facilityModel = require("../models/facilityModel");
const imageModel = require("../models/imageModel");
const fs = require("fs/promises");
const path = require("path");
const { UPLOAD_DIR, detectImageType, sha256, removeFileQuietly } = require("../utils/imageFiles");

const MAX_IMAGES_PER_REPORT = 5;

// Admin can access any report; a resident only their own. The resident is
// always looked up from the authenticated token, never from the request.
async function canAccess(user, report) {
  if (user.role === "admin") return true;
  const resident = await residentModel.findByUserId(user.id);
  return !!resident && resident.resident_id === report.resident_id;
}

// Residents may add/remove photos only while the report is still pending --
// once an admin starts reviewing, the evidence shouldn't change under them.
// Admins are exempt.
function photosLocked(user, report) {
  return user.role !== "admin" && report.status !== "pending";
}

async function list(req, res, next) {
  try {
    if (req.user.role === "admin") {
      return success(res, await reportModel.findAll());
    }
    const resident = await residentModel.findByUserId(req.user.id);
    if (!resident) return success(res, []);
    success(res, await reportModel.findAllByResident(resident.resident_id));
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const report = await reportModel.findById(req.params.id);
    if (!report) return error(res, "Report not found.", 404);
    if (!(await canAccess(req.user, report))) {
      return error(res, "You can only view your own reports.", 403);
    }
    success(res, report);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    if (req.user.role !== "resident") {
      return error(res, "Only residents can submit damage reports.", 403);
    }

    const { facility, category, location, description } = req.body;
    if (!facility || !category || !location || !description) {
      return error(res, "Please complete all required fields.", 400);
    }

    const resident = await residentModel.findByUserId(req.user.id);
    if (!resident) {
      return error(res, "No resident profile found for this account.", 400);
    }

    const facilityRow = await facilityModel.findByName(facility);
    if (!facilityRow) {
      return error(res, `Unknown facility: ${facility}`, 400);
    }

    const report = await reportModel.create({
      resident_id: resident.resident_id,
      facility_id: facilityRow.facility_id,
      category,
      description,
      location,
    });
    success(res, report, "Report submitted successfully!", 201);
  } catch (err) {
    next(err);
  }
}

async function uploadImage(req, res, next) {
  const file = req.file;
  // By the time this runs, multer has ALREADY written the file to disk. So
  // every early rejection below must delete it, or rejected uploads would
  // pile up as orphan files.
  const discard = () => (file ? removeFileQuietly(file.path) : Promise.resolve());

  try {
    if (!file) return error(res, "No image was attached.", 400);

    const report = await reportModel.findById(req.params.id);
    if (!report) {
      await discard();
      return error(res, "Report not found.", 404);
    }
    if (!(await canAccess(req.user, report))) {
      await discard();
      return error(res, "You can only attach photos to your own reports.", 403);
    }
    if (photosLocked(req.user, report)) {
      await discard();
      return error(res, "Photos can only be added while a report is still pending.", 403);
    }
    if (report.images.length >= MAX_IMAGES_PER_REPORT) {
      await discard();
      return error(res, `A report can have at most ${MAX_IMAGES_PER_REPORT} photos.`, 400);
    }

    // The MIME type came from the browser and can be faked; check the real bytes.
    const buffer = await fs.readFile(file.path);
    if (!detectImageType(buffer)) {
      await discard();
      return error(res, "This file isn't a valid image. Please choose a JPEG, PNG, or WebP image.", 400);
    }

    // Same photo already on this report (e.g. a retry after a dropped
    // connection)? Don't create a second record.
    const hash = sha256(buffer);
    if (await imageModel.findByHash(report.report_id, hash)) {
      await discard();
      return error(res, "This photo is already attached to the report.", 409);
    }

    let image;
    try {
      image = await imageModel.create({
        report_id: report.report_id,
        image_path: `/uploads/${file.filename}`,
        file_hash: hash,
      });
    } catch (dbErr) {
      await discard(); // no database row -> don't keep the file either
      if (dbErr.code === "ER_DUP_ENTRY") {
        // Two identical uploads raced past the check above; the unique index caught it.
        return error(res, "This photo is already attached to the report.", 409);
      }
      throw dbErr;
    }

    success(res, image, "Image uploaded successfully", 201);
  } catch (err) {
    await discard();
    next(err);
  }
}

// Photos are NOT served from a public folder. The frontend fetches each
// one here with its login token, so viewing is protected by the same
// ownership check as everything else.
async function getImage(req, res, next) {
  try {
    const report = await reportModel.findById(req.params.id);
    if (!report) return error(res, "Report not found.", 404);
    if (!(await canAccess(req.user, report))) {
      return error(res, "You can only view photos on your own reports.", 403);
    }

    const image = await imageModel.findById(req.params.imageId);
    if (!image || image.report_id !== report.report_id) {
      return error(res, "Image not found.", 404);
    }

    // basename + the `root` option together prevent path traversal.
    res.set("Cache-Control", "private, max-age=3600");
    res.sendFile(path.basename(image.image_path), { root: UPLOAD_DIR }, (err) => {
      if (err && !res.headersSent) error(res, "Image file is missing.", 404);
    });
  } catch (err) {
    next(err);
  }
}

async function deleteImage(req, res, next) {
  try {
    const report = await reportModel.findById(req.params.id);
    if (!report) return error(res, "Report not found.", 404);
    if (!(await canAccess(req.user, report))) {
      return error(res, "You can only remove photos from your own reports.", 403);
    }
    if (photosLocked(req.user, report)) {
      return error(res, "Photos can only be removed while a report is still pending.", 403);
    }

    const image = await imageModel.findById(req.params.imageId);
    if (!image || image.report_id !== report.report_id) {
      return error(res, "Image not found.", 404);
    }

    // Database row first, file second: if deleting the file fails we're
    // left with a harmless stray file, not a database row pointing at
    // nothing.
    await imageModel.remove(image.image_id);
    await removeFileQuietly(path.join(UPLOAD_DIR, path.basename(image.image_path)));
    success(res, {}, "Image removed.");
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, uploadImage, getImage, deleteImage };
