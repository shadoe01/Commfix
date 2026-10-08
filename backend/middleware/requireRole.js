const { error } = require("../utils/apiResponse");

// Must run AFTER authenticate (so req.user already exists). Blocks the
// request if the logged-in user's role doesn't match what the route
// requires -- e.g. a resident token hitting an admin-only route.
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, "Not authenticated. Please log in.", 401);
    }
    if (req.user.role !== role) {
      return error(res, `This action requires the '${role}' role.`, 403);
    }
    next();
  };
}

module.exports = requireRole;
