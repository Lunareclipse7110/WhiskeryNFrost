const express  = require("express");
const router   = express.Router();
const MenuItem = require("../models/MenuItem");

// GET /api/menu  — fetch all available items (optionally filter by category)
router.get("/", async (req, res) => {
  try {
    const filter = { available: true };
    if (req.query.category) filter.category = req.query.category;

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/menu/:id  — single item
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;