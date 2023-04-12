const mongoose = require("mongoose");
const bagPerso = mongoose.Schema({
  _id: String,
  Competence: [Number],
  Sac: [String],
  Tour: [Number],
  ValeurBonus: [Number],
  NbrePotion: Number,
  time: Date,
});

module.exports = mongoose.model("fichepersobags", bagPerso);
