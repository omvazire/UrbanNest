const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapasync.js");
const expressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);


    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};



//reviews Post route
router.post("/", validateReview, wrapAsync( async (req,res) =>{
let listingR = await listing.findById(req.params.id);
let newReview = new review(req.body.review);

listingR.reviews.push(newReview);

await newReview.save();
await listingR.save();

res.redirect(`/listings/${listingR._id}`);
}));



//reviews delete route
router.delete("/:reviewId", wrapAsync (async (req,res) =>{
   let{id, reviewId} = req.params; 

   await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await review.findByIdAndDelete(reviewId);

   res.redirect(`/listings/${id}`);
}));



module.exports = router;
