const express= require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Reviews = require("../models/reviews");
const {isLoggedIn, isOwner} = require("../middleware")

const multer  = require('multer')
const storage = require("../cloudConfig")
const upload = multer({storage})

const listingController = require("../controllers/listings");

//index route
router.get("/", listingController.index);

//search functionality
router.get("/search", listingController.searchFuntionality);

//creating post
router.post("/", isLoggedIn, upload.single("image"), listingController.createNewPost);

//show route
router.get("/:id", listingController.showListing)

//edit route
router.put("/:id", isLoggedIn, isOwner, upload.single("image"), listingController.editListing)

//delete route
router.delete("/:id", isLoggedIn, isOwner, listingController.deleteListing)

module.exports = router;