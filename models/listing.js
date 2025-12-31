const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    image: {
        filename: String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1570563234994-a7a7be1e01a5?q=80&w=1468&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

            set: (v) => v === "" ? "https://images.unsplash.com/photo-1570563234994-a7a7be1e01a5?q=80&w=1468&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
        },



    },

    price: {
        type: Number
    },

    location: {
        type: String
    },

    country: {
        type: String
    },


    reviews: [
        {
          type: Schema.Types.ObjectId,
          ref: "review" , 
        },
    ],

    owner:{
      type: Schema.Types.ObjectId,
      ref: "user",
    },

});


listingSchema.post("findOneAndDelete", async (listing) =>{
   if (listing)
    { 
        await review.deleteMany({_id : {$in: listing.reviews}});
   }
});


const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
