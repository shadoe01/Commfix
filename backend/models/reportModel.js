const { pool } = require("../config/db");
const imageModel = require("./imageModel");

// Shared SELECT shape: joins in the facility name and the reporting
// resident's name, since the frontend displays those, not raw ids.
const BASE_SELECT = `
  SELECT
    r.report_id, r.resident_id, r.facility_id, r.category, r.description,
    r.location, r.status, r.severity, r.created_at, r.updated_at,
    f.facility_name,
    u.name AS resident_name,
    (SELECT di.image_id FROM damage_images di
       WHERE di.report_id = r.report_id
       ORDER BY di.uploaded_at, di.image_id LIMIT 1) AS thumbnail_image_id
  FROM damage_reports r
  JOIN facilities f ON f.facility_id = r.facility_id
  JOIN residents res ON res.resident_id = r.resident_id
  JOIN users u ON u.user_id = res.user_id
`;

async function findAll() {
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY r.created_at DESC`);
  return rows;
}

async function findAllByResident(residentId) {
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE r.resident_id = ? ORDER BY r.created_at DESC`,
    [residentId]
  );
  return rows;
}

// Used for the single-report view (Report Details), so it also attaches
// the report's images. The list endpoints (findAll / findAllByResident)
// deliberately don't do this -- fetching images for every row in a list
// would be an extra query per report (N+1), and My Reports doesn't show
// thumbnails (see the Day 12 note on scope).
async function findById(id) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE r.report_id = ?`, [id]);
  const report = rows[0];
  if (!report) return null;
  report.images = await imageModel.findByReportId(id);
  return report;
}

async function create({ resident_id, facility_id, category, description, location }) {
  const [result] = await pool.query(
    `INSERT INTO damage_reports (resident_id, facility_id, category, description, location)
     VALUES (?, ?, ?, ?, ?)`,
    [resident_id, facility_id, category, description, location]
  );
  return findById(result.insertId);
}

module.exports = { findAll, findAllByResident, findById, create };
