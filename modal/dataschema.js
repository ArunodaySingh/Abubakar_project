// store name, last, buy, Sell, volume, base_unit
const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema({
  store_name: {
    type: String,
  },
  last: {
    type: Number,
  },
  sell: {
    type: Number,
  },
  buy: {
    type: Number,
  },
  volume: {
    type: Number,
  },
  base_unit: {
    type: String,
  },
});

module.exports = mongoose.model("AbuBakarProject", DataSchema);
