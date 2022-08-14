const mongoose = require("mongoose");
const salonQuete = mongoose.Schema({
  _id: String,
  Pinte: [String, String, String, String, String],

  time: Date,
});

module.exports = mongoose.model("salonQuest", salonQuete);
