const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/air');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

app.get("/", (req, res) => {
    res.send("this is root");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);


    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};




const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);


    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};





//index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});



//show rote
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { foundListing });
}));


//creat route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    console.log(newListing);
})
);



//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const listing2 = await listing.findById(id);
    res.render("listings/edit.ejs", { listing2 });
}));



//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);

}));



//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


//reviews Post route
app.post("/listings/:id/reviews", validateReview, wrapAsync( async (req,res) =>{
let listingR = await listing.findById(req.params.id);
let newReview = new review(req.body.review);

listingR.reviews.push(newReview);

await newReview.save();
await listingR.save();

res.redirect(`/listings/${listingR._id}`);
}));



//reviews delete route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync (async (req,res) =>{
   let{id, reviewId} = req.params; 

   await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await review.findByIdAndDelete(reviewId);

   res.redirect(`/listings/${id}`);
}));



// app.get("/test", async (req, res) =>{
// let samplelisting = new listing({
//    title: "my new villa",
//    description:"hello to home",
//    price: 5000,
//    location: "goa",
//    country:"india"
// });

// await samplelisting.save();
// console.log("sample was saved");
// res.send("succeful testing");
// });







app.use((req, res, next) => {
    next(new expressError(404, "page not found!!!"));
});



app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!!" } = err;

    res.status(statusCode).render("error.ejs", { message });


    // res.status(statusCode).send(message);
});



app.listen(3000, () => {
    console.log("app listning to port 3000");
});