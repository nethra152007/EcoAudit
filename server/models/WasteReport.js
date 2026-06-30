const mongoose = require("mongoose");

const wasteReportSchema = new mongoose.Schema({

  category: {
    type: String,
    required: true
  },

  weight: {
    type: Number,
    required: true
  },

  latitude: {
    type: Number,
    required: true
  },

  longitude: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "WasteReport",
  wasteReportSchema
);