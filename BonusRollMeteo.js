const mongoose = require("mongoose");
const salonBonusMeteo = mongoose.Schema({
  _id: String,
  EauBonus1: [String],
  EauBonus2: [String],
  EauBonusNuit: [String],
  FeuBonus1: [String],
  time: Date,
});

module.exports = mongoose.model("meteoSalonBonus", salonBonusMeteo);
