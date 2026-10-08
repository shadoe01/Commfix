const { error } = require("../utils/apiResponse");

// Runs when no route matched the request -- e.g. GET /api/does-not-exist.
function notFound(req, res) {
  error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

module.exports = notFound;
