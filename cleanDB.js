require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Listing = require("./models/listing");
const Review = require("./models/reviews");
const Inquiry = require("./models/inquiry");
const Chat = require("./models/chat");
const Message = require("./models/message");

const Mongo_URI = process.env.Mongo_URI || "mongodb://127.0.0.1:27017/wonderlust";

const cleanDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(Mongo_URI);
    console.log("Connected successfully.");

    console.log("Starting database cleanup...");

    // 1. Delete dependent data first
    console.log("Deleting Messages...");
    const messageRes = await Message.deleteMany({});
    console.log(`Deleted ${messageRes.deletedCount} messages.`);

    console.log("Deleting Chats...");
    const chatRes = await Chat.deleteMany({});
    console.log(`Deleted ${chatRes.deletedCount} chats.`);

    console.log("Deleting Inquiries...");
    const inquiryRes = await Inquiry.deleteMany({});
    console.log(`Deleted ${inquiryRes.deletedCount} inquiries.`);

    console.log("Deleting Reviews...");
    const reviewRes = await Review.deleteMany({});
    console.log(`Deleted ${reviewRes.deletedCount} reviews.`);

    // 2. Delete main entities
    console.log("Deleting Listings...");
    const listingRes = await Listing.deleteMany({});
    console.log(`Deleted ${listingRes.deletedCount} listings.`);

    console.log("Deleting Users...");
    const userRes = await User.deleteMany({});
    console.log(`Deleted ${userRes.deletedCount} users.`);

    // 3. Clear sessions
    try {
      console.log("Clearing Sessions...");
      const sessionRes = await mongoose.connection.collection('sessions').deleteMany({});
      console.log(`Deleted ${sessionRes.deletedCount} sessions.`);
    } catch (err) {
      console.log("Could not clear sessions or sessions collection does not exist.");
    }

    console.log("Database cleanup completed successfully!");
  } catch (err) {
    console.error("Error during database cleanup:", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

cleanDB();
