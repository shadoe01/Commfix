// TEMPORARY -- see the note in controllers/dbTestController.js.
const express = require("express");
const {
  listUsers,
  insertTestUser,
  updateTestUser,
  deleteTestUser,
} = require("../controllers/dbTestController");

const router = express.Router();

router.get("/users", listUsers);                 // SELECT
router.post("/users", insertTestUser);            // INSERT
router.put("/users/:id", updateTestUser);          // UPDATE
router.delete("/users/:id", deleteTestUser);       // DELETE

module.exports = router;
