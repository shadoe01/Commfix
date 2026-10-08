const express = require("express");
const authenticate = require("../middleware/authenticate");
const requireRole = require("../middleware/requireRole");
const { notImplemented } = require("../controllers/adminController");

const router = express.Router();

// Genuinely admin-only resource (account management) -- see the note in
// README.md about why /api/admin isn't a catch-all for every admin action.
router.get("/users", authenticate, requireRole("admin"), notImplemented("GET /api/admin/users"));
router.post("/users", authenticate, requireRole("admin"), notImplemented("POST /api/admin/users"));

module.exports = router;
