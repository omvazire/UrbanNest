const listing = require("../models/listing");
const review = require("../models/review.js");



module.exports.createReview = async (req,res) =>{
let listingR = await listing.findById(req.params.id);
let newReview = new review(req.body.review);
newReview.author = req.user._id;
listingR.reviews.push(newReview);
console.log(newReview);
await newReview.save();
await listingR.save();
req.flash("success", "New review created succesfully!!")
res.redirect(`/listings/${listingR._id}`);
};

module.exports.destroyReview = async (req,res) =>{
   let{id, reviewId} = req.params; 

   await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await review.findByIdAndDelete(reviewId);
req.flash("success", "Review Deleted succesfully!!")
   res.redirect(`/listings/${id}`);
};