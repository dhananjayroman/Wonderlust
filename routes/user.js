const express= require("express");
const router = express.Router();


const { authenticate } = require("passport");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users")

router.get("/signup", userController.renderSignupForm)

router.post("/signup", userController.signUp)

router.get("/login",userController.renderLoginForm)

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password ❌"
  }),
  userController.logIn
);

router.get("/logout", userController.logOut)

module.exports = router;