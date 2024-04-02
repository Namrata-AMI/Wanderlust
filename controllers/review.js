const listings = require("../models/listings.js");
const Review = require("../models/review.js");


module.exports.createReview = async(req,res)=>{  // "/" is child route of its parent of /listings in app.js//
    let listing = await listings.findById(req.params.id);
    let newReview = new Review(req.body.review);              // create new reveiew//
    newReview.author = req.user._id;


    listing.review.push(newReview);         // review here, is => from review arr defined in listing.js//
    await newReview.save();
    await listing.save();

    console.log(newReview);
    console.log(listing);
    console.log("new review saved");
    req.flash("success" ," New Review is Added");
    res.redirect(`/listings/${listing._id}`)   // here listing is =>listing id extracted abode in (req.params.id)//

}



module.exports.deleteReview = async(req,res)=>{        // /:reviewId is child route//
    let {id,reviewsId} = req.params;
    await  listings.findByIdAndUpdate(id,{$pull:{review:reviewsId}});
    await Review.findByIdAndDelete(reviewsId);
    req.flash("success" ,"Review is Deleted");
    res.redirect(`/listings/${id}`);
    }