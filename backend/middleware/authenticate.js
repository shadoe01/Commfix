const jwt = require("jsonwebtoken");
const { error } = require("../utils/apiResponse");

// Checks for a valid "Authorization: Bearer <token>" header on the
// request. If valid, attaches the decoded info to req.user (id, role,
// name, email) so later middleware/controllers can use it. If missing or
// invalid, stops the request here with 401 -- the route handler never runs.
function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return error(res, "Not authenticated. Please log in.", 401);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return error(res, "Session expired or invalid. Please log in again.", 401);
  }
}

module.exports = authenticate;
