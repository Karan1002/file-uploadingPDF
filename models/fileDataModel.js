const mongoose = require("mongoose");

const fileModel = new mongoose.Schema({
  Count: {
    type: Number,
    required: true,
  },
  Searching_name: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("PDF-Data", fileModel);
