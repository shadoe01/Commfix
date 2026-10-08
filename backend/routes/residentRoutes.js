const express = require("express");
const authenticate = require("../middleware/authenticate");
const { notImplemented } = require("../controllers/residentController");

const router = express.Router();

router.get("/", authenticate, notImplemented("GET /api/residents"));
router.get("/:id", authenticate, notImplemented("GET /api/residents/:id"));
router.put("/:id", authenticate, notImplemented("PUT /api/residents/:id"));

module.exports = router;
