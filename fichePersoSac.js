const mongoose = require("mongoose");
const bagPerso = mongoose.Schema({
  _id: String,
  Competence: [String],
  Sac: [String],
  time: Date,
});

module.exports = mongoose.model("fichepersobag", bagPerso);
