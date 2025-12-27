const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");


router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapasync( async(req,res)=>{
    try{
        let {username, email, password} = req.body;
    const newUser = new User({email, username});
   const registeredUser = await User.register(newUser, password);
   console.log(registeredUser);


   req.flash("success", "welcome to UrbenNest");
   res.redirect("/listings")
    }catch(error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    };
    
}));



router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});


router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), async(req,res)=>{
    req.flash("success","Welcome to UrbenNest You are logged in");
    res.redirect("/listings");
});

module.exports = router;