const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listings.js");


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

app.get("/listing",async(req,res)=>{
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



app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})