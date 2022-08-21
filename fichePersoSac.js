const mongoose = require("mongoose");
const bagPerso = mongoose.Schema({
  _id: String,
  Competence: [Number, Number, Number, Number, Number, Number, Number, Number],
  Sac: [String],
  time: Date,
});

module.exports = mongoose.model("fichepersobag", bagPerso);
