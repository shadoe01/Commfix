const express = require("express");
const authenticate = require("../middleware/authenticate");
const { notImplemented } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", authenticate, notImplemented("GET /api/notifications"));
router.put("/:id/read", authenticate, notImplemented("PUT /api/notifications/:id/read"));

module.exports = router;
