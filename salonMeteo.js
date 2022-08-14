const mongoose = require("mongoose");
const salonTemps = mongoose.Schema({
  _id: String,
  Salon: [
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
    String,
  ],

  time: Date,
});

module.exports = mongoose.model("salonWeather", salonTemps);
