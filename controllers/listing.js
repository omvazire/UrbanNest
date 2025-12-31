const listing = require("../models/listing");


module.exports.index = async (req, res) => {
  const { search } = req.query;

  let allListings;

  if (search && search.trim() !== "") {
    const regex = new RegExp(search, "i"); // case-insensitive

    allListings = await listing.find({
      $or: [
        { title: regex },
        { country: regex },
        { location: regex },
      ],
    });
  } else {
    allListings = await listing.find({});
  }

  res.render("listings/index.ejs", { allListings, search });
};

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id).populate({path: "reviews", populate:{path: "author"}, }).populate("owner");
    if(!foundListing){
        req.flash("error", "Requested listing does not exist!!!");
        return res.redirect("/listings")
    }
    console.log(foundListing);
    res.render("listings/show.ejs", { foundListing });
};


module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New listing created succesfully!!");
    res.redirect("/listings");
    console.log(newListing);
};


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const listing2 = await listing.findById(id);
     if(!listing2){
        req.flash("error", "Requested listing does not exist!!!");
        return res.redirect("/listings")
    }

    let originalImgUrl = listing2.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing2, originalImgUrl});
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

   
   let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file != "undefined"){

    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = {url, filename};
    await Listing.save();
 }
    req.flash("success", "Listing updated succesfully")
    res.redirect(`/listings/${id}`);

};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted succesfully!!");
    res.redirect("/listings");
};