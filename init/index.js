const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listings.js");
const axios = require('axios');
let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


const MAP_TOKEN = "pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
 

main()
.then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}


////////*****  using axios for dataBase initialisation *********///////////
/*const mapboxAccessToken = process.env.MAP_TOKEN;
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

async function addGeometryToEachListing(initData){
try{
   const updatedListings = [];
   for(const listing of initData){
       const geometry = await geocodeLocation(listing.location);
       if (geometry) {
       const updatedListingGeo = ({...listing, geometry});
       updatedListings.push(updatedListingGeo);
   }
}
       return updatedListings;
   }
   catch(error){
       console.log("error adding geometry to listings:",error);
}
}

addGeometryToEachListing(initData.data)
.then(updatedListings=>
initDB(updatedListings))
.catch(error =>
   console.log("ERROR:",error));
const init = async (initData)=>{
await listing.deleteMany({});
initData = initData.map((obj)=>
   ({...obj,owner:"6606423fd4b7ebd8ad6efbc1"}));
await listing.insertMany(initData);
console.log("data was initialising");
}*/

/////////////////////////////////////////////////////////////




const initDB = async()=>{                             //initialising db//
    await listing.deleteMany({});                     // first empty the db before initilaise//
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:'6606423fd4b7ebd8ad6efbc1',
    }));
    await listing.insertMany(initData.data);           // then inserting data to db//
    console.log("data was initialised");
   
}
initDB();
console.log(initData);