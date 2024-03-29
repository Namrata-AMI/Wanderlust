const listings = require("./models/listings.js");
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
  //  console.log(req);
   // console.log(req.path, "...", req.originalUrl);   
      
    if(!req.isAuthenticated()){          // isAuthenticate() is a method that checks info stored in session using passport//
        req.session.redirectUrl = req.originalUrl;       // if user not logged in before we take there redirect url//
        req.flash("error","you must be logged in!");
        return res.redirect("/login");
    }
    next();
}


// so, we will use "locals" to save our "req.session.redirectUrl" redirectUrl value , As passport don't have access to delete locals//

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;      // saving req's redirectUrl value to res's local redirectUrl variable//
    }
    next();
}


module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listings = await listings.findById(id);
    if(!newUser && listings.owner_id.equals(res.locals.newUser._id)){             // check if ! owner === newUser_id//
        req.flash("error","you dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



/////// validate listing data //////////
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);             // extract our error
    console.log(error);
    if(error && error.details){
        let errMsg = error.details.map((el)=>el.message).join(",");     // err message
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
 

/////// validate comment  data //////////
module.exports.validateReview = (req,res,next)=>{
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



module.exports.isReviewOwner = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = Review.findById(reviewId);
    console.log(reviewId);
    if(!review.author.equals(res.locals.newUser._id)){             // check if ! owner === newUser_id//
        req.flash("error","you dont have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
     
}