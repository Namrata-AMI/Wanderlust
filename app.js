    if(process.env.NODE_ENV != "production"){    //we will not use .env in our production phase//
            require('dotenv').config()
    }
    //console.log(process.env.SECRET);


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
    const MongoStore = require('connect-mongo');
    const flash = require("connect-flash");
    const passport = require("passport");
    const LocalStrategy = require("passport-local");
    const User = require("./models/user.js");
    const axios = require("axios");
    const listings = require("./init/index.js")            // required data.js///////


    const listingRouter = require("./routes/listings.js");
    const reviewRouter = require("./routes/review.js");
    const userRouter = require("./routes/user.js");


    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));
    app.use(methodOverride("_method"))
    app.engine("ejs",ejsMate);
    app.use(express.static(path.join(__dirname,"public")));

    /*app.get("/",(req,res)=>{
        res.send("server is working..");
    });*/


    const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
    const dbUrl = process.env.ATLASDB_URL;


    const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto:{
            secret: process.env.SECRET,            // our secret
        },
        touchAfter : 24 * 3600,
    });

    store.on("error",(err)=>{
        console.log("ERROR IN MONGO STORE",err);
    });

    const sessionOptions = {
        store: store,
        secret: process.env.SECRET,         // oour secret
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


    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));   // users to get authenticate through LocalStrategy method and to authenticate that user we use "authenticate()" method//      //authenticate is our static method// 

    passport.serializeUser(User.serializeUser());          // to serialise the user session when on website//
    passport.deserializeUser(User.deserializeUser());      // to deserialise the user session when not using website//


    app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
        res.locals.newUser = req.user;        // here we are storing the current user session //
        console.log(res.locals.newUser);
        next();
    });


    /*app.get("/demouser",async(req,res)=>{
        let fakeUser = new User({
            email:"student@gmail.com",
            username:"Delta-student",
        });
        let registeredUser = await User.register(fakeUser,"helloworld") ; // register() is method to store user data in db//
        res.send(registeredUser);
    })*/


    app.use("/listings",listingRouter);              // here, /listings is a parent route in app.js"
    app.use("/listings/:id/reviews",reviewRouter)      // /listings/:id/reviews is a parent route//
    app.use("/",userRouter);




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
        await mongoose.connect(dbUrl);   
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



    
////////*****  using axios for dataBase initialisation *********///////////
         const mapboxAccessToken = process.env.MAP_TOKEN;
         async function geocodeLocation(location){
            try{
                const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`,
                {
                    params:{
                        access_token : mapboxAccessToken
                    }
                });
                const result = response.data.features[0];
                const coordinates = result.geometry.coordinates;
                return {type:"Point",coordinates};
            }
            catch(error){
                console.log("error geocoding location:", location , error);
                return null;
            }
         }
  
    async function addGeometryToEachListing(listings){
        try{
            const updatedListings = [];
            for(const listing of listings){
                const geometry = await geocodeLocation(listing.location);
                if (geometry) {
                const updatedListingGeo = ({...listings, geometry});
                updatedListings.push(updatedListingGeo);
            }
        }
                return updatedListings;
            }
            catch(error){
                console.log("error adding geometry to listings:",error);
        }
    }
    addGeometryToEachListing(listings.data)
    .then(updatedListings=>
        initDB(updatedListings))
        .catch(error =>
            console.log("ERROR:",error));
    const initDB = async (initData)=>{
        await listings.deleteMany({});
        initData = initData.map((obj)=>
            ({...obj,owner:"661cd63c8e61911db30be10c"}));
        await listings.insertMany(initData);
        console.log("data was initialising");
    }

/////////////////////////////////////////////////////////////



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