const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    // const db = mongoose.connect(url);
    await mongoose.connect(url);
    console.log("Connected sucessfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
