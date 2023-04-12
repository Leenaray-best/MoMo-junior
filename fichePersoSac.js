const mongoose = require("mongoose");
const bagPerso = mongoose.Schema({
  _id: String,
  Competence: [Number],
  Sac: [String],
  Tour: [Number, Number],
  ValeurBonus: [Number],
  NbrePotion: Number,
  NbrePoison: Number,
  time: Date,
});

module.exports = mongoose.model("fichepersobags", bagPerso);
