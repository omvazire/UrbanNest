const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const sessionOption = {
secret: "supersecret", resave: false, saveUninitialized: true
}



app.use(session(sessionOption));
app.use(flash());

app.get("/register", (req,res) =>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
   req.flash("success", "user registered succesfully");
    res.redirect("/hello");
});

app.get("/hello", (req,res) =>{
  
   res.render("page.ejs", {name: req.session.name, msg: req.flash("success")})
});


// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++; 
//     }
//     else{
//         req.session.count = 1;

//     }
    
//     res.send(`you send a request ${req.session.count} times `);
// });

// app.get("/test", (req,res)=>{
//     res.send("test server");
// });


app.listen(3000, () => {
    console.log("server running to 3000")
})