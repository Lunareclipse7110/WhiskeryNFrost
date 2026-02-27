const mongoose = require("mongoose");

// Each item inside the order
const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
  name:       { type: String, required: true },
  emoji:      { type: String },
  price:      { type: Number, required: true },
  qty:        { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: () => "FF-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
    },
    items:         { type: [orderItemSchema], required: true },
    subtotal:      { type: Number, required: true },
    deliveryFee:   { type: Number, default: 49 },
    total:         { type: Number, required: true },

    // Delivery address
    address: {
      type:  { type: String, enum: ["saved", "new"], required: true }, // "saved" or "new"
      label: { type: String },          // "Home" / "Office" (for saved)
      text:  { type: String, required: true }, // full address string
    },

    // Payment
    paymentMethod: { type: String, enum: ["upi", "cod"], required: true },
    upiId:         { type: String, default: null },

    // Status
    status: {
      type: String,
      enum: ["placed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);