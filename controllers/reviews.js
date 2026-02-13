const Listing = require("../models/listing");
const Review = require("../models/reviews");   // singular


module.exports.createReview =  async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    const newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;

    console.log(newReview)

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.log(err);
    res.send("Error creating review");
  }
}

module.exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log(err);
    res.send("Error deleting review");
  }
}