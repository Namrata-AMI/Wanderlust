const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        require:true
    },

    description:{
        type:String,
        require:true
    },

    image:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJYXQooGXIj2Ec4z6K73Kq4pbH5BmwwU_sSBajbBCxvw&s",
        set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJYXQooGXIj2Ec4z6K73Kq4pbH5BmwwU_sSBajbBCxvw&s":v,              // setting v (value) of image//
    },

    price:{
        type:Number
    },

    location:{
        type:String
    },

    country:{
        type:String
    }
});

const listing = mongoose.model("Listing",listingSchema);

module.exports = listing;
