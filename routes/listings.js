const express = require("express");
const router = express.Router();           // creating our router object//
const wrapAsync = require("../utils/wrapAsync.js");
const listings = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer  = require('multer');            //multer  will read form data//
const { storage} = require("../cloudconfig.js");
const upload = multer({storage}); // now multer will by default save our files in coudinary storage//
//const upload = multer({ dest: 'uploads/' })  //multer will create "uploads" folder & transfer data to uploads folder //




router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn,
     upload.single('listing[image]'),             // a middleware in which multer parse images and upload to cloudnary//
     validateListing,
     wrapAsync(listingController.showListing))



//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);



router.route("/:id")
.get(wrapAsync(listingController.createListing)) 
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing,  wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))




// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm)
);


//category route
router.get("/:id/dest", wrapAsync(listingController.categoryListing)
);

module.exports = router;






