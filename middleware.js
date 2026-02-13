const Listing = require("./models/listing");
const Review = require("./models/reviews");

const { reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


module.exports.isOwner = async(req, res, next) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id);

  if(!listing.owner.equals(res.locals.currentUser._id))
  {
    req.flash("error", "You are not the owner of this Listing")
    return res.redirect(`/listings/${id}`);
  }
  next()
}



module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    req.flash("error", errMsg);
    return res.redirect("back");
  } else {
    next();
  }
};


module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    // ✅ If review not found
    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
    }

    // ✅ Check logged-in user is author
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("back");
  }
};
