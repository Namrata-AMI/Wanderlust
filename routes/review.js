const express = require("express");
const router = express.Router({mergeParams:true});  // here, mergeParams is 
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const listings = require("../models/listings.js");


/////// validate comment  data //////////
const validateReview = (req,res,next)=>{
    console.log(req.body,"hello");
    let {error} = reviewSchema.validate(req.body);             // extract our error
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");     // err message
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}



//Reviews
/////////   only  post route      /////////
router.post("/", validateReview ,wrapAsync(async(req,res)=>{  // "/" is child route of its parent of /listings in app.js//
    let listing = await listings.findById(req.params.id);
    let newReview = new Review(req.body.review);              // create new reveiew//


    listing.review.push(newReview);         // review here, is => from review arr defined in listing.js//
    await newReview.save();
    await listing.save();

    console.log(newReview);
    console.log(listing);
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)   // here listing is =>listing id extracted abode in (req.params.id)//

}));


//delete route
router.delete("/:reviewsId",wrapAsync(async(req,res)=>{        // /:reviewId is child route//
let {id,reviewsId} = req.params;
await  listings.findByIdAndUpdate(id,{$pull:{review:reviewsId}});
await review.findByIdAndDelete(reviewsId);
res.redirect(`/listings/${id}`);
}))


module.exports = router;