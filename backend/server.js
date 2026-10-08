require("dotenv").config();
const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/index");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { testConnection } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors({ origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(",") }));
app.use(express.json());


// --- Routes ---
app.get("/", (req, res) => {
  res.send("Commfix Backend is running. Try GET /api/test");
});
app.use("/api", apiRoutes);

// --- 404 + error handling (must be registered last) ---
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Commfix Backend is running`);
  console.log(`Server listening on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/test`);

  // Day 8: prove the database connection works, separately from any one
  // route, per the plan's step 7-8. The server still starts even if this
  // fails -- a missing DB shouldn't take down routes that don't need it.
  try {
    await testConnection();
    console.log(`Database connected successfully`);
  } catch (err) {
    console.error(`Database connection failed: ${err.message}`);
    console.error(`Check your .env database settings and that MySQL (e.g. XAMPP) is running.`);
  }
});
