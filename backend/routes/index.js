const express = require("express");
const { success } = require("../utils/apiResponse");

const authRoutes = require("./authRoutes");
const reportRoutes = require("./reportRoutes");
const residentRoutes = require("./residentRoutes");
const facilityRoutes = require("./facilityRoutes");
const notificationRoutes = require("./notificationRoutes");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

// The required Day 7 proof-of-life endpoint.
router.get("/test", (req, res) => {
  success(res, {}, "COMMFIX API is running");
});

router.use("/auth", authRoutes);
router.use("/reports", reportRoutes);
router.use("/residents", residentRoutes);
router.use("/facilities", facilityRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
