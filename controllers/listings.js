const Listing = require("../models/listing")

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MY_ACCESS_TOKEN = process.env.MAPBOX_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });


module.exports.index = async(req,res)=>{
    let lists = await Listing.find();
    //console.log(lists)
    res.render("listings/index.ejs", { lists });

}

module.exports.renderNewForm = async(req,res)=>{
   
   res.render("listings/new.ejs")
}

module.exports.createNewPost = async (req, res, next) => {
  
  try {
  const response= await geocodingClient.forwardGeocode({
  query: req.body.location,
  limit: 1
  })
  .send()

  //console.log(coOrdinates.body.features[0].geometry)
  
  const { title, description, price, location, country, image } = req.body;

    let url=req.file.path;
    let filename=req.file.filename;

    const Addnewlist = new Listing({
      title,
      description,
      price,
      location,
      country,
      image: { url: image, filename: "listingimage" } // matching your schema
    });

    Addnewlist.owner = req.user._id;
    Addnewlist.image = {url, filename}
    Addnewlist.geometry = response.body.features[0].geometry
    await Addnewlist.save();
    console.log("Added new listing:", Addnewlist);

    res.redirect("/"); // redirect to the list page
    
  } catch (err) {
    // console.error("Error adding listing:", err);
    // res.status(500).send("Error saving listing");
    next(err)
  }
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let allLists = await Listing.findById(id).populate({path :"reviews", populate : {path : "author"}}).populate("owner");
    //console.log(allLists)
    res.render("listings/show.ejs", {allLists})
}

module.exports.renderEditForm = async(req,res)=>{
  let {id} = req.params;
  let allLists = await Listing.findById(id);

  let OriginalImgUrl = allLists.image.url;
  OriginalImgUrl=OriginalImgUrl.replace("/upload", "/upload/h_250,w_200")

  res.render("listings/edit.ejs",{allLists, OriginalImgUrl})
}

module.exports.editListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;

    // 1Update basic fields
    const listing = await Listing.findByIdAndUpdate(
      id,
      { title, description, price, location, country },
      { new: true }
    );

    // 2️If new image uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
      await listing.save(); // 🔥 VERY IMPORTANT
    }

    // 3️Always redirect
    res.redirect(`/listings/${id}`);

  } catch (error) {
    console.log("Error updating listing:", error);
    res.redirect("/listings");
  }
};

module.exports.searchFuntionality = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    req.flash("error", "Please enter something to search ");
    return res.redirect("/listings");
  }

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } }
    ]
  });

  if (listings.length === 0) {
    req.flash(
      "error",
      `No listings found for "${q}". Try a different place or title `
    );
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { lists: listings });
};



module.exports.deleteListing = async(req,res)=>{
  let {id} = req.params;
  let deleteList = await Listing.findByIdAndDelete(id);
 // console.log("delete list",deleteList);
  res.redirect("/listings")
}