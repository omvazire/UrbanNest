const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapasync.js");
const expressError = require("../utils/expressError.js");

const review = require("../models/review.js");
const listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")



const reviewController = require("../controllers/reviews.js")

//reviews Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));



//reviews delete route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync (reviewController.destroyReview));



module.exports = router;
