const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const { isLoggedIn, isAdmin } = require("../middleware");

// All admin routes require login + admin role
router.use(isLoggedIn, isAdmin);

// Dashboard
router.get("/stats", adminController.getDashboardStats);

// Users
router.get("/users", adminController.getAllUsers);

// Listings
router.get("/listings", adminController.getAllListingsAdmin);
router.get("/listings/pending", adminController.getPendingListings);
router.put("/listings/:id/moderate", adminController.moderateListing);

// Seller verification
router.get("/seller-requests", adminController.getPendingSellerRequests);
router.put("/users/:id/moderate-seller", adminController.moderateSellerRequest);

module.exports = router;
