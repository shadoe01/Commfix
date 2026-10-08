const express = require("express");
const { register, login } = require("../controllers/authController");
const { success } = require("../utils/apiResponse");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Logout is a client-side action with JWTs (just delete the stored token --
// see src/context/AuthContext.jsx on the frontend). This endpoint exists so
// the route from the Day 7 plan still resolves to something, not a 404.
router.post("/logout", (req, res) => {
  success(res, {}, "Logged out.");
});

module.exports = router;
