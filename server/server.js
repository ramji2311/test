const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();
// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json());

const mongoose = require("mongoose");

// Ensure DB connection is active on every request (essential for serverless Vercel environment)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    console.log("📡 Database disconnected. Reconnecting...");
    await connectDB();
  }
  next();
});

// Database connection status debug endpoint
app.get("/api/db-status", (req, res) => {
  res.json({
    success: true,
    mongoUriConfigured: !!process.env.MONGO_URI,
    connectionState: mongoose.connection.readyState,
    connectionStateDescription: {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    }[mongoose.connection.readyState]
  });
});

// Routes
// const authRoutes = require("./routes/authRoutes");
// const customerRoutes = require("./routes/customerRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const measurementRoutes = require("./routes/measurementRoutes");
const orderRoutes = require("./routes/orderRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const reportRoutes = require("./routes/reportRoutes");



// Mount routes
// app.use("/api/auth", authRoutes);
// app.use("/api/customers", customerRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/measurements", measurementRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/reports", reportRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Miara Tailor ERP Backend Running Successfully 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;