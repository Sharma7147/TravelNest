const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

// Debug: check the imported data
console.log("Imported data:", initdata);

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airdata");
}

const initdb = async () => {
  try {
     await Listing.deleteMany({});
     initdata.data=initdata.data.map((obj)=>({...obj,owner:'672dbdb76aab2badd7e3efc1'}))
    await Listing.insertMany(initdata.data);
    console.log("Data initialized successfully.");
  } catch (err) {
    console.log("Error initializing data:", err);
  }
};

// Call the function to initialize the database
initdb();












