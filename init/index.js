require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listings.js");

const dbUrl = process.env.ATLASDB_URL;

console.log("DB URL exists:", !!dbUrl);

async function main() {
    await mongoose.connect(dbUrl);
    console.log("working db");

    await listing.deleteMany({});
    console.log("old data deleted");

    const data = initData.data.map((obj) => ({
        ...obj,
        owner: "6aa636e95e8d1a87db30e3e0"
    }));

    await listing.insertMany(data);

    console.log("data was initialised");

    await mongoose.connection.close();
    console.log("database connection closed");
}

main().catch((err) => {
    console.log("Initialization error:", err);
});