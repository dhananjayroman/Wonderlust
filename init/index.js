// init.js
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// MongoDB URI
const MONGO_URI = "mongodb://127.0.0.1:27017/wonderlust";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

// Initialize Data
const initDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Listing.deleteMany({});
    console.log("🗑️  Old listings deleted");

    // Insert new data
    initData.data = initData.data.map((obj)=>({...obj, owner:"6954d075770d4d1ea063668a"}))
    await Listing.insertMany(initData.data);
    console.log("🌱 Database initialized with sample data");

  } catch (error) {
    console.error("⚠️  Error initializing database:", error);
  } finally {
    mongoose.connection.close(); // Close DB connection after operation
    console.log("🔒 MongoDB connection closed");
  }
};

// Run Initialization
initDB();
