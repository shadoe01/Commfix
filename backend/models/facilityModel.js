const { pool } = require("../config/db");

async function findAll() {
  const [rows] = await pool.query("SELECT * FROM facilities ORDER BY facility_name");
  return rows;
}

async function findByName(name) {
  const [rows] = await pool.query("SELECT * FROM facilities WHERE facility_name = ?", [name]);
  return rows[0] || null;
}

module.exports = { findAll, findByName };
