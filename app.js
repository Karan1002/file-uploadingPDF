require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/connectDB");
const fileRoute = require("./routes/fileRoute");

const port = 5000 || process.env.PORT;
app.use("/", fileRoute);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
