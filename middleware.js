const listing = require("./models/listing");
const review = require("./models/review");
const expressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");



module.exports.isLoggedIn = (req,res,next) =>{
if(! req.isAuthenticated()){
req.session.redirectUrl = req.originalUrl;

req.flash("error", "you must be logged in to create listing");
return res.redirect("/login");
    }
    next();
};



module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner= async(req,res, next) =>{
    let {id} = req.params;
     let Updatelisting = await listing.findById(id);
    if(!Updatelisting.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }

    next();
}


module.exports.validateListing = async(req,res,next) =>{

  
    let { error } = listingSchema.validate(req.body);


    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } 
        next();
    
};





module.exports.validateReview =

 async (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);


    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } 
        next();
}

module.exports.isReviewAuthor= async(req,res, next) =>{
    let {id, reviewId} = req.params;
     let Updatereview = await review.findById(reviewId);
    if(!Updatereview.author.equals(res.locals.currUser._id)){
        req.flash("error", "you are not author of this review");
        return res.redirect(`/listings/${id}`)
    }

    next();
}

