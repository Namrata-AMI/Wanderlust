const express = require("express");
const router = express.Router();           // creating our router object//
const wrapAsync = require("../utils/wrapAsync.js");
const listings = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");


// index route
router.get("/", wrapAsync(async (req,res)=>{
    let allListings = await listings.find({});  
    res.render("listing/index.ejs",{allListings});
})
);


//new route
router.get("/new", isLoggedIn,(req,res)=>{
    console.log(req.user);               // printing the valid logged in user//
res.render("listing/new.ejs");
});


// create route
router.post("/", validateListing, isLoggedIn, wrapAsync(async(req,res,next)=>{
    const newListing = new listings(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    // new listing(req.body.listing)          // here '.listing' is object and using listing a model to access ".listing"// 
    await newListing.save();
    console.log(listings);
    req.flash("success" ," New Listing is Added");
    res.redirect("/listings");
})
);


// show route
router.get("/:id",wrapAsync(async(req,res)=>{
let {id} = req.params;
const listingitem = await listings.findById(id).populate({path: "review", populate:{path:"author",},}).populate("owner");   
if(!listingitem){                   // "listingitem" is not exist on above condition basis then execute the followings//
    req.flash("error","Listing you requested not Exists!");
    res.redirect("/listings")
}
console.log(listingitem);
res.render("listing/show.ejs",{listingitem}); 
})
);


// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req,res)=>{
let {id} = req.params;
const listing = await listings.findById(id);    // then find out listing on id basis//
if(!listing){
    req.flash("error","Listing you requested not exists!");
    res.redirect("/listings")
}
res.render("listing/edit.ejs",{listing})
})
);


// update route 
router.put("/:id",validateListing, isLoggedIn, isOwner, wrapAsync(async(req,res)=>{
let {id} = req.params;
await listings.findByIdAndUpdate(id,{...req.body.listing});  // here, we have deconstructed & updated our javascript obj {...} //
console.log("edited");
req.flash("success" ," Listing is Updated");
res.redirect(`/listings/${id}`);
})
);


// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req,res)=>{
let {id} = req.params;
let deleted = await listings.findByIdAndDelete(id);
console.log(deleted);
req.flash("success" ," Listing is Deleted");
res.redirect("/listings");
})
);


module.exports = router;






