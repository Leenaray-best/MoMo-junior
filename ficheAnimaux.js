const mongoose = require("mongoose");

const Animaux = mongoose.Schema({
  _id: String,
  Username: String,
  Competence: [String],
  Avantage: [String],
  Inconvenient: [String],
  Actions: [String],
  Histoire: String,
  PointDeVie: Number,
  Image: String,
  time: Date,
});

module.exports = mongoose.model("FicheAnimaux", Animaux);
