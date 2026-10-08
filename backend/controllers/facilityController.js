const { success } = require("../utils/apiResponse");

// Day 7 scope: structure only. Each handler below just confirms the route
// is wired up correctly -- real logic (queries, validation, etc.) is built
// starting Day 8+.

const notImplemented = (label) => (req, res) => {
  success(res, {}, `${label} endpoint reachable. Logic not implemented yet (Day 8+).`);
};

module.exports = { notImplemented };
