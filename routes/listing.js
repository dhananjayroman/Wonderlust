const express= require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Reviews = require("../models/reviews");
const {isLoggedIn, isOwner}=require("../middleware")

const multer  = require('multer')
const storage = require("../cloudConfig")
const upload = multer({storage})

const listingController = require("../controllers/listings");

//index route
router.get("/", listingController.index);


//create route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//search functionality
router.get("/search", listingController.searchFuntionality);

//creating post
router.post("/", upload.single("image"), listingController.createNewPost, (req,res)=>{
    res.send(req.file)
});


//show route
router.get("/:id", listingController.showListing)

//edit route
router.get("/:id/edit",isLoggedIn, listingController.renderEditForm)

router.put("/:id",isLoggedIn, isOwner,upload.single("image"), listingController.editListing)

router.delete("/:id",isLoggedIn,isOwner, listingController.deleteListing)





module.exports = router;