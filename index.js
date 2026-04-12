const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const { connectDB }    = require("./config/db");
const { initFirebase } = require("./config/firebase");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const verifyToken = require("./middleware/verifyToken");
const { getDashboardStats } = require("./controllers/requestController");

const userRoutes    = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const donorRoutes   = require("./routes/donorRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.SITE_DOMAIN  || "http://localhost:5173",
    "https://mission11scic.vercel.app",
  ],
  credentials: true,
}));
app.use(express.json());

// ── Health Check ────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "BloodCare API is running 🩸" });
});

// ── Routes ──────────────────────────────────────────────
app.get("/dashboard/stats", verifyToken, getDashboardStats);

app.use("/users",    userRoutes);
app.use("/requests", requestRoutes);
app.use("/donors",   donorRoutes);
app.use("/contact",  contactRoutes);
app.use("/",         paymentRoutes);

// ── 404 & Error Handler ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Bootstrap ───────────────────────────────────────────
const start = async () => {
  try {
    initFirebase();
    await connectDB();
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Server running → http://localhost:${PORT}`);
      }
    });
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
};

start();
