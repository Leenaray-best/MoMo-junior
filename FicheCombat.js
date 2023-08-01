const mongoose = require("mongoose");

const Combat = mongoose.Schema({
  _id: Number,
  TourGlobal: [Number],
  IdJoueur: [String],
  TourJoueur: [Number],
  TM16: [Number],
  M16Activ: [Number],
  M16ActivAbove10: [Number],
  TM10: [Number],
  TM3: [Number],
  time: Date,
});

module.exports = mongoose.model("FicheCombat", Combat);
