
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    // Debug logging
    if (!mongoURI) {
      console.error("❌ MONGO_URI is not defined in environment variables!");
      console.error("Available env vars:", Object.keys(process.env).filter(key => key.includes("MONGO") || key.includes("PORT")));
      console.warn("⚠️  Running in offline mode - using mock data");
      return false;
    }

    console.log("📡 Connecting to MongoDB...");
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
  console.error("FULL ERROR:");
  console.error(error);
  console.error(error.stack);
}
};

module.exports = connectDB;