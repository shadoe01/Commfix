// One-off CLI tool to create an admin account, since registration
// (POST /api/auth/register) is deliberately resident-only -- admin
// accounts are provisioned directly, not self-registered (see the Day 2
// document's open items, and the note in authController.js).
//
// Usage:
//   node scripts/createAdmin.js "Admin Name" admin@commfix.local somepassword

require("dotenv").config();
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

async function main() {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.log("Usage: node scripts/createAdmin.js \"Admin Name\" admin@example.com somepassword");
    process.exit(1);
  }

  const existing = await userModel.findByEmail(email);
  if (existing) {
    console.log(`A user with email ${email} already exists (role: ${existing.role}).`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.create({ name, email, password: passwordHash, role: "admin" });
  console.log("Admin account created:", user);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});
