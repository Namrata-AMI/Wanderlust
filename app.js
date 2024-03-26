const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
//const listings = require("./models/listings.js");          /*commented required files because they are now not in use*/
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
//const {listingSchema , reviewSchema} = require("./schema.js");
//const Review = require("./models/review.js");

const listing = require("./routes/listings.js");
const reviews = require("./routes/review.js")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


app.use("/listings",listing);              // here, /listings is a parent route in app.js"
app.use("/listings/:id/reviews",reviews)      // /listings/:id/reviews is a parent route//



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
});


app.use((err,req,res,next)=>{
    console.log(err.message);
    let {statusCode=500,message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{err});
   // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})