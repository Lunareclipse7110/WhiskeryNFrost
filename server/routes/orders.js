const express = require("express");
const router  = express.Router();
const Order   = require("../models/Order");

// POST /api/orders  — place a new order
router.post("/", async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, total, address, paymentMethod, upiId } = req.body;

    // Basic validation
    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: "Order must have at least one item" });
    if (!address || !address.text)
      return res.status(400).json({ success: false, message: "Delivery address is required" });
    if (!paymentMethod)
      return res.status(400).json({ success: false, message: "Payment method is required" });

    const order = await Order.create({
      items, subtotal, deliveryFee, total,
      address, paymentMethod,
      upiId: paymentMethod === "upi" ? upiId : null,
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders  — list all orders (for admin / testing)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:orderId  — single order by orderId string (e.g. FF-ABC12)
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;