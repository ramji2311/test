
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://ramankkn504_db_user:snJHJOOgF5ErCM1B@erp-website.harja1h.mongodb.net/?appName=Erp-website";

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