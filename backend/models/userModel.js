// Real queries against the `users` table (Day 8). All values are passed as
// parameters (the `?` placeholders), never concatenated into the SQL
// string, so this is safe against SQL injection.
//
// Note: password hashing is NOT done here -- that's Day 9's job. This
// model just stores whatever string it's given in the password column.

const { pool } = require("../config/db");

async function findAll() {
  const [rows] = await pool.query("SELECT user_id, name, email, role, created_at FROM users");
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query("SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?", [id]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

async function create({ name, email, password, role }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );
  return findById(result.insertId);
}

async function update(id, { name, email }) {
  await pool.query("UPDATE users SET name = ?, email = ? WHERE user_id = ?", [name, email, id]);
  return findById(id);
}

async function remove(id) {
  await pool.query("DELETE FROM users WHERE user_id = ?", [id]);
}

module.exports = { findAll, findById, findByEmail, create, update, remove };
