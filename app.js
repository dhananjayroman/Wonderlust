require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const User = require("./models/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const passport = require("passport");
const LocalStrategy = require("passport-local");


const flash = require("connect-flash");
const methodOverride = require("method-override");

const app = express();
const port = 8080;

// ==================== CONFIG ====================
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// ==================== DATABASE ====================

//const URI = "mongodb://127.0.0.1:27017/wonderlust";
console.log("ATLAS URI:", process.env.Mongo_URI);

mongoose.connect(process.env.Mongo_URI)
  .then(() => console.log("Database Connected Sucessfully"))
  .catch(err => console.log("DB Error", err));

// ==================== SESSION ====================
//We use connect-mongo to persist user sessions in MongoDB so authentication remains stable, scalable, and production-ready.

// const store = MongoStore.create({
//   mongoUrl: process.env.Mongo_URI,
//   crypto: {
//     secret: process.env.SESSION_SECRET
//   },
//   touchAfter: 24 * 3600
// });

// store.on("error", (err) => {
//   console.log("SESSION STORE ERROR", err);
// });

app.use(
  session({
    // store,
    name: "session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

// ==================== FLASH ====================
app.use(flash());

// ==================== PASSPORT ====================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==================== LOCALS (🔥 MUST BE HERE) ====================


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;

  //console.log("FLASH SUCCESS:", res.locals.success);
  //console.log("FLASH ERROR:", res.locals.error);

  next();
});



// ==================== ROUTES ====================
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/testflash", (req, res) => {
  req.flash("success", "FLASH IS WORKING 🔥");
  res.redirect("/listings");
});



// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something went wrong");
});

// ==================== SERVER ====================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
