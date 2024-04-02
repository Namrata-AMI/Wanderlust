const listings = require("../models/listings.js")


module.exports.index = async (req,res)=>{
    let allListings = await listings.find({});  
    res.render("listing/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);               // printing the valid logged in user//
res.render("listing/new.ejs");
}

module.exports.showListing = async(req,res,next)=>{
    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new listings(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    // new listing(req.body.listing)          // here '.listing' is object and using listing a model to access ".listing"// 
    await newListing.save();
   // console.log(listings);
    req.flash("success" ," New Listing is Added");
    res.redirect("/listings");
}


module.exports.createListing = async(req,res)=>{
    let {id} = req.params;
    const listingitem = await listings.findById(id).populate({path: "review", populate:{path:"author",},}).populate("owner");   
    if(!listingitem){                   // "listingitem" is not exist on above condition basis then execute the followings//
        req.flash("error","Listing you requested not Exists!");
        res.redirect("/listings");
    }
    console.log(listingitem);
    res.render("listing/show.ejs",{listingitem}); 
    }


module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await listings.findById(id);    // then find out listing on id basis//
    if(!listing){
        req.flash("error","Listing you requested not exists!");
        res.redirect("/listings")
    }
    res.render("listing/edit.ejs",{listing})
}


module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await listings.findByIdAndUpdate(id,{...req.body.listing});  // here, we have deconstructed & updated our javascript obj {...} //

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    console.log("edited");
    req.flash("success" ," Listing is Updated");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deleted = await listings.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success" ," Listing is Deleted");
    res.redirect("/listings");
}