const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");



const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
//username and password is alredy defined by passport local mongoose hence no need to define them
});


userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("user", userSchema);