const express= require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users");
const { isLoggedIn } = require("../middleware");

router.post("/signup", userController.signUp);
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ success: false, message: info?.message || "Invalid username or password" });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return userController.logIn(req, res, next);
        });
    })(req, res, next);
});
router.post("/logout", userController.logOut);
router.get("/me", userController.getCurrentUser);

// OTP Phone Verification routes
router.post("/send-otp", isLoggedIn, userController.sendOTP);
router.post("/verify-otp", isLoggedIn, userController.verifyOTP);
router.post("/request-seller", isLoggedIn, userController.requestSellerStatus);

// Wishlist routes
router.get("/wishlist", isLoggedIn, userController.getWishlist);
router.post("/wishlist", isLoggedIn, userController.addToWishlist);
router.delete("/wishlist/:id", isLoggedIn, userController.removeFromWishlist);

module.exports = router;