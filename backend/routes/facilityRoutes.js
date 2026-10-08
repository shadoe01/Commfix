const express = require("express");
const authenticate = require("../middleware/authenticate");
const { notImplemented } = require("../controllers/facilityController");

const router = express.Router();

router.get("/", authenticate, notImplemented("GET /api/facilities"));
router.post("/", authenticate, notImplemented("POST /api/facilities"));
router.put("/:id", authenticate, notImplemented("PUT /api/facilities/:id"));

module.exports = router;
