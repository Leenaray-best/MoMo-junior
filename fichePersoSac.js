const mongoose = require("mongoose");
const bagPerso = mongoose.Schema({
  _id: String,
  Competence: [{ type: Number }],
  Sac: [String],
  time: Date,
});

module.exports = mongoose.model("BagPersoFiche", bagPerso);
