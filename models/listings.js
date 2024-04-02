const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

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
        url : String,
        filename: String,
    },

    price:{
        type:Number
    },

    location:{
        type:String
    },

    country:{
        type:String
    },

    review:
    [
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

});


listingSchema.post("findOneAndDelete",async(listings)=>{
    if(listings){
        await review.deleteMany({_id:{$in: listings.review}});   
    }
  
})

const listing = mongoose.model("Listing",listingSchema);

module.exports = listing;
