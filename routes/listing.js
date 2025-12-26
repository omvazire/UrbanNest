const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const listing = require("../models/listing.js");



const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);


    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};


//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});



//show rote
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id).populate("reviews");
    if(!foundListing){
        req.flash("error", "Requested listing does not exist!!!");
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs", { foundListing });
}));


//creat route
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created succesfully!!");
    res.redirect("/listings");
    console.log(newListing);
})
);


//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const listing2 = await listing.findById(id);
     if(!listing2){
        req.flash("error", "Requested listing does not exist!!!");
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing2 });
}));



//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated succesfully")
    res.redirect(`/listings/${id}`);

}));



//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted succesfully!!");
    res.redirect("/listings");
}));



module.exports = router;