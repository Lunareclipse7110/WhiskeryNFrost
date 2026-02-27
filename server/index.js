const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const menuRoutes  = require("./routes/menu");
const orderRoutes = require("./routes/orders");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173" })); // Vite dev server
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/menu",   menuRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "Whiskery & Frost API is running 🧁" }));

// ── Connect DB then start server ────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });