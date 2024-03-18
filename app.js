const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const listing = require("./models/listings.js");
const path = require("path");
const listings = require("./models/listings.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
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

/////// validate listing data //////////
const validateListing = (req,res,next)=>{
    let error = listingSchema.validate(req.body);             // extract our error
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");     // err message
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

/////// validate comment  data //////////
const validateReview = (req,res,next)=>{
    console.log(req.body,"hello");
    let error = reviewSchema.validate(req.body);             // extract our error
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");     // err message
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


// index route
app.get("/listings", wrapAsync(async (req,res)=>{
        let allListings = await listings.find({});  
        res.render("listing/index.ejs",{allListings});
})
);


//new route
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
});


// create route
app.post("/listings", validateListing,wrapAsync(async(req,res,next)=>{
        const newListing = new listings(req.body.listing);
        // new listing(req.body.listing)          // here '.listing' is object and using listing a model to access ".listing"// 
        await newListing.save();
        console.log(listings);
        res.redirect("/listings");
    })
);


// show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listingitem = await listings.findById(id).populate("review");   
    res.render("listing/show.ejs",{listingitem}); 
})
);


// edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await listings.findById(id);    // then find out listing on id basis//
    res.render("listing/edit.ejs",{listing})
})
);


// update route 
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await listings.findByIdAndUpdate(id,{...req.body.listing});  // here, we have deconstructed & updated our javascript obj {...} //
    console.log("edited");
    res.redirect(`/listings/${id}`);
})
);


// delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleted = await listings.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
})
);


//Reviews
/////////   only  post route      /////////
app.post("/listings/:id/reviews", validateReview ,wrapAsync(async(req,res)=>{
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

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"some error"));
})


app.use((err,req,res,next)=>{
    console.log(err.message);
    let {statusCode=500,message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{err});
   // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})