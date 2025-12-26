const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");



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




app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)






app.use((req, res, next) => {
    next(new expressError(404, "page not found!!!"));
});



app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});



app.listen(3000, () => {
    console.log("app listning to port 3000");
});



//learned cookies basic after express routers