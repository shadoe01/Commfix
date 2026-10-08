// MySQL connection pool, using the plain mysql2 driver (no ORM).
// A pool is used instead of a single connection so multiple requests can
// query the database at the same time without waiting on each other.
//
// Day 7 scope: this module only prepares the connection. Actually calling
// testConnection() and wiring real queries happens on Day 8.

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "commfix",
  waitForConnections: true,
  connectionLimit: 10,
});

async function testConnection() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
}

module.exports = { pool, testConnection };
