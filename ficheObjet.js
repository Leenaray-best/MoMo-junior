const mongoose = require("mongoose");
const ListObject = mongoose.Schema({
  _id: String,
  Dague: [Number],
  Armure: [Number],
  Potion: [String],
  time: Date,
});

module.exports = mongoose.model("ficheobject", ListObject);
