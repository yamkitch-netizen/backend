import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import MenuItem from "./models/MenuItem.js";
import Order from "./models/Order.js";
import { seedMenuIfEmpty } from "./seedMenu.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "yamkitch-admin";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid admin password" });
  }
  return res.json({ ok: true });
});

// ── Menu Routes ────────────────────────────────────────────
app.get("/api/menu", async (req, res) => {
  try {
    const includeHidden = req.query.all === "true";
    const filter = includeHidden ? {} : { isAvailable: true };
    const items = await MenuItem.find(filter).sort({ category: 1, sortOrder: 1, createdAt: 1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/menu", async (req, res) => {
  try {
    const { category, name, price, desc, isBase, isAvailable, sortOrder } = req.body;
    if (!category || !name || price === undefined) {
      return res.status(400).json({ error: "category, name, and price are required" });
    }
    const item = await MenuItem.create({
      category,
      name: name.trim(),
      price: Number(price),
      desc: (desc || "").trim(),
      isBase: Boolean(isBase),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      sortOrder: Number(sortOrder) || 0,
    });
    res.status(201).json({ item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/menu/:id", async (req, res) => {
  try {
    const updates = {};
    const allowed = ["category", "name", "price", "desc", "isBase", "isAvailable", "sortOrder"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = key === "price" || key === "sortOrder" ? Number(req.body[key]) : req.body[key];
      }
    }
    const item = await MenuItem.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: "Menu item not found" });
    res.json({ item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/menu/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Menu item not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Order Routes ───────────────────────────────────────────
app.get("/api/orders", async (req, res) => {
  try {
    const { month, status, search } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [year, m] = month.split("-").map(Number);
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { invoiceNumber: regex },
        { "customer.name": regex },
        { "customer.phone": regex },
        { "customer.email": regex },
        { "customer.organisation": regex },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch("/api/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Email Route (Resend) ───────────────────────────────────
app.post("/api/send-email", async (req, res) => {
  try {
    const { subject, html, to } = req.body;
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "RESEND_API_KEY is not configured" });
    }

    const rawRecipients = Array.isArray(to) ? to : to ? [to] : [];
    const recipients = [...new Set(rawRecipients.map((addr) => String(addr).trim()).filter(Boolean))];
    const finalTo = recipients.length > 0 ? recipients : ["yamkitch@gmail.com"];

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "YAMKITCH Portal <portal@yamkitch.in>",
        to: finalTo,
        subject,
        html,
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server & Connect MongoDB ─────────────────────────
async function start() {
  if (!MONGO_URI) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
  await seedMenuIfEmpty();

  app.listen(PORT, () => {
    console.log(`YAMKITCH backend running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start backend:", err);
  process.exit(1);
});
