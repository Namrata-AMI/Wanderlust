const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
//const listings = require("./models/listings.js");          /*commented unrequired files because they are now not in use*/
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
//const {listingSchema , reviewSchema} = require("./schema.js");
//const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");


const listing = require("./routes/listings.js");
const reviews = require("./routes/review.js")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    res.send("server is working..");
});

const sessionOptions = {
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());                            // always define sessions before "flash"//

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    next();
});


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