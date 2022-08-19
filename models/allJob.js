const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AllJobSchema = new Schema({
  title: String,
  description: String,
  location: String,
  eligible: String,
  experience: String,
  payment: String,
  skills: String,
  hasApplied: { type: Boolean, default: false },
});

module.exports = mongoose.model("AllJob", AllJobSchema);
