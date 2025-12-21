const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");

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

//index route
app.get("/listings", async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});



//show rote
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    res.render("listings/show.ejs", { foundListing });
});


//creat route
app.post("/listings", async (req, res) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    console.log(newListing);
});



//edit route
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const listing2 = await listing.findById(id);
    res.render("listings/edit.ejs", { listing2 });
});

//update route

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);

});


//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})



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



app.listen(3000, () => {
    console.log("app listning to port 5566");
});