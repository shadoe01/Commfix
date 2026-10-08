const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, error } = require("../utils/apiResponse");
const userModel = require("../models/userModel");
const residentModel = require("../models/residentModel");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign(
    { id: user.user_id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// Registration is resident-only, on purpose -- same decision noted back in
// the Day 2 document: admin accounts are provisioned directly in the
// database, never through public self-registration.
async function register(req, res, next) {
  try {
    const { name, email, password, confirmPassword, contact, address } = req.body;

    if (!name || !email || !password || !contact || !address) {
      return error(res, "Please complete all required fields.", 400);
    }
    if (!EMAIL_RE.test(email)) {
      return error(res, "Please enter a valid email.", 400);
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return error(res, "Passwords do not match.", 400);
    }
    if (password.length < 6) {
      return error(res, "Password must be at least 6 characters.", 400);
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return error(res, "Email is already registered.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, password: passwordHash, role: "resident" });
    await residentModel.create({ user_id: user.user_id, contact_number: contact, address });

    success(res, { user }, "Registration successful!", 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Please enter your email and password.", 400);
    }

    const user = await userModel.findByEmail(email);
    // Deliberately the same message whether the email doesn't exist or the
    // password is wrong -- per Day 9 step 10, this avoids confirming to an
    // attacker which emails are registered.
    if (!user) {
      return error(res, "Invalid email or password.", 401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return error(res, "Invalid email or password.", 401);
    }

    const token = signToken(user);
    const { password: _omit, ...safeUser } = user;
    success(res, { token, user: safeUser }, "Login successful.");
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
