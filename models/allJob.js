const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AllJobSchema = new Schema({
  title: String,
  description: String,
  location: String,
  eligible: String,
});

module.exports = mongoose.model("AllJob", AllJobSchema);
