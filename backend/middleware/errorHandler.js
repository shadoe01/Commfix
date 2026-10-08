const { error } = require("../utils/apiResponse");

// Catches anything thrown or passed to next(err) anywhere in the app, so a
// bug in one route returns a clean JSON error instead of crashing the
// whole server.
function errorHandler(err, req, res, next) {
  console.error(err);

  // Multer's own errors (e.g. file too large) don't set err.status --
  // they're still the client's fault (a bad upload), not a server bug, so
  // this maps them to 400 instead of the default 500.
  if (err.name === "MulterError") {
    const message = err.code === "LIMIT_FILE_SIZE"
      ? "This image is too large. Please choose a file under 5 MB."
      : err.message;
    return error(res, message, 400);
  }

  const status = err.status || 500;
  error(res, err.message || "Something went wrong", status);
}

module.exports = errorHandler;
