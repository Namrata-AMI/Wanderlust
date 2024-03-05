const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const listing = require("./models/listings.js");
const path = require("path");
const listings = require("./models/listings.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine","views");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs","ejsMate");
app.use(express.static(path.join(__dirname,"public")));


main()
.then((res)=>{
    console.log(res);
    console.log("working db")
})
.catch((err)=>{
    console.log(err);
    console.log("db error")
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/",(req,res)=>{
    res.send("server is working..");
});


// index route
app.get("/listings",async (req,res)=>{
        let allListings = await listings.find({});  
        res.render("listing/index.ejs",{allListings});
});


//new route
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
});


// create route
app.post("/listings",async(req,res)=>{
    const newListing = new listings(req.body.listing);
    // new listing(req.body.listing)          // here '.listing' is object and using listing a model to access ".listing"// 
    await newListing.save();
    console.log(listing);
    res.redirect("/listings");
})

// show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listingitem = await listings.findById(id);
    res.render("listing/show.ejs",{listingitem}); 
});


// edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await listings.findById(id);    // then find out listing on id basis//
    res.render("listing/edit.ejs",{listing})
});


// update route 
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await listings.findByIdAndUpdate(id,{...req.body.listing});  // here, we have deconstructed & updated our javascript obj {...} //
    console.log("edited");
    res.redirect(`/listings/${id}`);
})


// delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let deleted = await listings.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
});

/*app.get("/listing",async(req,res)=>{
    let sampleListing = new listing({
        title:"villa",
        discription:"a new luxurious villa",
        image:"",
        price:1200,
        location:"Chandigarh, Haryana",
        country:"India"
    });

    await sampleListing.save();
    console.log("data saved");
});
*/


app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})