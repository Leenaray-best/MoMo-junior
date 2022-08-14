const mongoose = require("mongoose");
const Bonus = mongoose.Schema({
  _id: String,
  Terre: [
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
  Air: [String, String, String, String, String],
  Eau: [String, String, String, String, String],
  Feu: [String, String, String, String, String],

  time: Date,
});

module.exports = mongoose.model("salonBonus", Bonus);
