const { pool } = require("../config/db");

async function findByUserId(userId) {
  const [rows] = await pool.query("SELECT * FROM residents WHERE user_id = ?", [userId]);
  return rows[0] || null;
}

async function create({ user_id, household_id = null, contact_number, address }) {
  const [result] = await pool.query(
    "INSERT INTO residents (user_id, household_id, contact_number, address) VALUES (?, ?, ?, ?)",
    [user_id, household_id, contact_number, address]
  );
  const [rows] = await pool.query("SELECT * FROM residents WHERE resident_id = ?", [result.insertId]);
  return rows[0];
}

module.exports = { findByUserId, create };
