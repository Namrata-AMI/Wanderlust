const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listings.js");

main()
.then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async()=>{                             //initialising db//
    await listing.deleteMany({});                     // first empty the db before initilaise//
    await listing.insertMany(initData.data);           // then inserting data to db//
    console.log("data was initialised");
   
}
initDB();
console.log(initData);