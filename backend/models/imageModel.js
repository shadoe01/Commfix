const { pool } = require("../config/db");

const COLUMNS = "image_id, report_id, image_path, uploaded_at"; // file_hash stays server-side

async function findByReportId(reportId) {
  const [rows] = await pool.query(
    `SELECT ${COLUMNS} FROM damage_images WHERE report_id = ? ORDER BY uploaded_at, image_id`,
    [reportId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM damage_images WHERE image_id = ?`, [id]);
  return rows[0] || null;
}

async function findByHash(reportId, hash) {
  const [rows] = await pool.query(
    "SELECT image_id FROM damage_images WHERE report_id = ? AND file_hash = ?",
    [reportId, hash]
  );
  return rows[0] || null;
}

async function create({ report_id, image_path, file_hash }) {
  const [result] = await pool.query(
    "INSERT INTO damage_images (report_id, image_path, file_hash) VALUES (?, ?, ?)",
    [report_id, image_path, file_hash]
  );
  return findById(result.insertId);
}

async function remove(id) {
  await pool.query("DELETE FROM damage_images WHERE image_id = ?", [id]);
}

module.exports = { findByReportId, findById, findByHash, create, remove };
