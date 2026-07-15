const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiry");
const { isLoggedIn } = require("../middleware");

// Create a new inquiry (must be logged in)
router.post("/", isLoggedIn, inquiryController.createInquiry);

// Get inquiries sent by the logged-in user
router.get("/sent", isLoggedIn, inquiryController.getSentInquiries);

// Get inquiries received by the logged-in user (as a seller)
router.get("/received", isLoggedIn, inquiryController.getReceivedInquiries);

// Update status of a received inquiry
router.put("/:id/status", isLoggedIn, inquiryController.updateInquiryStatus);

module.exports = router;
