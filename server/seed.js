/**
 * seed.js  —  Run once to populate the database with menu items
 * Usage: node seed.js
 */
const mongoose = require("mongoose");
require("dotenv").config();
const MenuItem = require("./models/MenuItem");

const menuItems = [
  { name: "Sourdough Boule",     category: "Breads",    description: "Stone-oven baked, crispy crust, airy crumb",                  price: 349, emoji: "🍞", tag: "Bestseller" },
  { name: "Artisan Bagel",       category: "Breads",    description: "Hand-rolled, sesame-seeded, kettle boiled",                   price: 169, emoji: "🥯", tag: null },
  { name: "Banana Walnut Bread", category: "Breads",    description: "Slow-baked, moist, golden topped",                            price: 349, emoji: "🍌", tag: null },
  { name: "Butter Croissant",    category: "Pastries",  description: "Laminated dough, 27 layers of French butter",                 price: 149, emoji: "🥐", tag: "Daily Fresh" },
  { name: "Cinnamon Roll",       category: "Pastries",  description: "Soft-pulled dough, cream cheese frosting",                    price: 189, emoji: "🌀", tag: null },
  { name: "Almond Danish",       category: "Pastries",  description: "Frangipane filling, flaked almonds, honey glaze",             price: 179, emoji: "🌸", tag: null },
  { name: "Blueberry Muffin",    category: "Muffins",   description: "Wild blueberries folded into vanilla crumb",                  price: 129, emoji: "🫐", tag: null },
  { name: "Chocolate Fondant",   category: "Cakes",     description: "Warm Belgian chocolate, molten center",                       price: 299, emoji: "🍫", tag: "Signature" },
  { name: "Strawberry Tart",     category: "Cakes",     description: "Crème pâtissière, fresh strawberries, glaze",                price: 329, emoji: "🍓", tag: "Chef's Pick" },
  { name: "Caramel Latte",       category: "Beverages", description: "Double espresso, steamed oat milk, salted caramel",           price: 249, emoji: "☕", tag: "Popular" },
  { name: "Belgian Hot Coco",    category: "Beverages", description: "Dark chocolate, steamed milk, topped with cream",             price: 199, emoji: "🍫", tag: null },
  { name: "Matcha Latte",        category: "Beverages", description: "Ceremonial grade matcha, silky steamed milk",                 price: 249, emoji: "🍵", tag: "New" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing items
    await MenuItem.deleteMany({});
    console.log("🗑️  Cleared existing menu items");

    // Insert fresh items
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`🌱 Seeded ${inserted.length} menu items successfully`);

    console.log("\nItems added:");
    inserted.forEach(item => console.log(`  ✦ ${item.emoji} ${item.name} — ₹${item.price}`));

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Done. Database connection closed.");
    process.exit(0);
  }
}

seed();