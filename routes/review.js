const express = require("express");
const router = express.Router({mergeParams:true});  // here, mergeParams is 
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const listings = require("../models/listings.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");


//Reviews
/////////   only  post route      /////////
router.post("/",isLoggedIn,   validateReview , wrapAsync(reviewController.createReview));



//delete route
router.delete("/:reviewsId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview))


module.exports = router;