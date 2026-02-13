const express = require("express");
const router = express.Router({ mergeParams: true });


const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

const reviewController = require("../controllers/reviews")

// =====================
// CREATE REVIEW
// =====================
router.post("/", isLoggedIn,validateReview, reviewController.createReview);

// =====================
// DELETE REVIEW
// =====================
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;
