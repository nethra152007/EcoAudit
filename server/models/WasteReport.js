const mongoose = require("mongoose");

const wasteReportSchema = new mongoose.Schema({
  image: String,
  wasteType: String,
  description: String,

  latitude: Number,
  longitude: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "WasteReport",
  wasteReportSchema
);