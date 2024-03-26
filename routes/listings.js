const express = require("express");
const router = express.Router();           // creating our router object//
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const listings = require("../models/listings.js");


/////// validate listing data //////////
const validateListing = (req,res,next)=>{
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
 

// index route
router.get("/", wrapAsync(async (req,res)=>{
    let allListings = await listings.find({});  
    res.render("listing/index.ejs",{allListings});
})
);


//new route
router.get("/new",(req,res)=>{
res.render("listing/new.ejs");
});


// create route
router.post("/", validateListing,wrapAsync(async(req,res,next)=>{
    const newListing = new listings(req.body.listing);
    // new listing(req.body.listing)          // here '.listing' is object and using listing a model to access ".listing"// 
    await newListing.save();
    console.log(listings);
    res.redirect("/listings");
})
);


// show route
router.get("/:id",wrapAsync(async(req,res)=>{
let {id} = req.params;
const listingitem = await listings.findById(id).populate("review");   
res.render("listing/show.ejs",{listingitem}); 
})
);


// edit route
router.get("/:id/edit", wrapAsync(async (req,res)=>{
let {id} = req.params;
const listing = await listings.findById(id);    // then find out listing on id basis//
res.render("listing/edit.ejs",{listing})
})
);


// update route 
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
let {id} = req.params;
await listings.findByIdAndUpdate(id,{...req.body.listing});  // here, we have deconstructed & updated our javascript obj {...} //
console.log("edited");
res.redirect(`/listings/${id}`);
})
);


// delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
let {id} = req.params;
let deleted = await listings.findByIdAndDelete(id);
console.log(deleted);
res.redirect("/listings");
})
);


module.exports = router;






