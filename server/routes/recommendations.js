const express  = require("express");
const router   = express.Router();
const MenuItem = require("../models/MenuItem");

router.post("/", async (req, res) => {
  try {
    const { cartItems = [], currentFilter = "All" } = req.body;

    const allItems  = await MenuItem.find({ available: true });
    const cartIds   = cartItems.map(i => (i._id || "").toString());
    const available = allItems
      .filter(i => !cartIds.includes(i._id.toString()))
      .sort(() => Math.random() - 0.5);

    if (available.length === 0) return res.json({ success: true, data: [] });

    const cartDesc = cartItems.length > 0
      ? cartItems.map(i => `${i.name} (₹${i.price})`).join(", ")
      : "empty cart";

    const menuDesc = available.map(i =>
      `ID:${i._id} | ${i.emoji} ${i.name} | ${i.category} | ₹${i.price} | ${i.description}`
    ).join("\n");

    const sessionSeed = Date.now();

    const prompt = `You are a bakery assistant for Whiskery & Frost, Bengaluru. [session:${sessionSeed}]

Customer cart: ${cartDesc}
Active filter: ${currentFilter}

Available items:
${menuDesc}

Recommend exactly 3 items. Consider complementary flavors and meal completeness.
Reply ONLY with valid JSON, no markdown, no extra text:
{"recommendations":[{"id":"EXACT_ID","reason":"under 10 words"},{"id":"EXACT_ID","reason":"under 10 words"},{"id":"EXACT_ID","reason":"under 10 words"}]}`;

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       "llama-3.1-8b-instant",
        max_tokens:  300,
        temperature: 1.2,
        messages: [
          {
            role:    "system",
            content: "You are a bakery recommendation assistant. Always reply with only valid JSON, no markdown, no extra text.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`Groq ${aiRes.status}: ${errText}`);
    }

    const aiData = await aiRes.json();
    const text   = aiData.choices[0].message.content.trim();
    const clean  = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    const recItems = parsed.recommendations
      .map(r => {
        const doc = allItems.find(i => i._id.toString() === r.id);
        return doc ? { ...doc.toObject(), aiReason: r.reason } : null;
      })
      .filter(Boolean)
      .slice(0, 3);

    res.json({ success: true, data: recItems });

  } catch (err) {
    console.error("Recommendations error:", err.message, err.cause?.message || "");
    try {
      const cartIds  = (req.body.cartItems || []).map(i => (i._id || "").toString());
      const all      = await MenuItem.find({ available: true, _id: { $nin: cartIds } });
      const fallback = all.sort(() => Math.random() - 0.5).slice(0, 3);
      res.json({ success: true, data: fallback.map(i => ({ ...i.toObject(), aiReason: "Popular choice" })) });
    } catch {
      res.json({ success: true, data: [] });
    }
  }
});

module.exports = router;