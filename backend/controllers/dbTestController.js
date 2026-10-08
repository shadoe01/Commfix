// TEMPORARY -- Day 8 only. This controller exists purely to prove the
// backend can SELECT, INSERT, UPDATE, and DELETE against a real database,
// per the Day 8 plan's steps 8-14. Delete this file and
// routes/dbTestRoutes.js once you've confirmed everything works; real
// registration (Day 9) replaces this with proper validation and password
// hashing.

const { success, error } = require("../utils/apiResponse");
const userModel = require("../models/userModel");

// Obviously-fake placeholder -- never a real password. Day 3's security
// plan says never store plaintext passwords, so even this temporary test
// avoids anything that looks like a real credential, and the record is
// deleted at the end of the test (step DELETE below).
const TEST_USER = {
  name: "Test Resident",
  email: "test.resident@example.com",
  password: "NOT-A-REAL-PASSWORD-delete-me",
  role: "resident",
};

async function listUsers(req, res, next) {
  try {
    const users = await userModel.findAll();
    success(res, users, "SELECT works.");
  } catch (err) {
    next(err);
  }
}

async function insertTestUser(req, res, next) {
  try {
    const existing = await userModel.findByEmail(TEST_USER.email);
    if (existing) {
      return error(res, "Test user already exists. DELETE it first (DELETE /api/db-test/users/:id).", 409);
    }
    const user = await userModel.create(TEST_USER);
    success(res, user, "INSERT works. Test user created.", 201);
  } catch (err) {
    next(err);
  }
}

async function updateTestUser(req, res, next) {
  try {
    const updated = await userModel.update(req.params.id, {
      name: "Test Resident (Updated)",
      email: TEST_USER.email,
    });
    if (!updated) return error(res, "No user with that ID.", 404);
    success(res, updated, "UPDATE works.");
  } catch (err) {
    next(err);
  }
}

async function deleteTestUser(req, res, next) {
  try {
    await userModel.remove(req.params.id);
    success(res, {}, "DELETE works. Test user removed.");
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, insertTestUser, updateTestUser, deleteTestUser };
