const mongoose = require("mongoose");
const salonQuete = mongoose.Schema({
  _id: String,
  Barreau: [String],
  Bateau: [String],
  Parchemin: [String],
  Frotter: [String],
  Lit: [String],

  time: Date,
});

module.exports = mongoose.model("salonQuest", salonQuete);
