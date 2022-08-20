const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jobDataSchema = new Schema(
  {
    name: {
      type: String,
      //   required: [true, "Please Provide Name"],
      //   minlength: 3,
      //   maxlength: 50,
    },
    location: {
      type: String,
      //   required: [true, "Please provide location"],
      //   maxlenght: 200,
    },
    email: {
      type: String,
      //   required: [true, "Please Provide Email"],
      //   // creates a validator that checks if the value matches the given regular expression
      //   match: [
      //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      //   ],
    },
    currentPosition: {
      type: String,
    },
    mobile: {
      type: Number,
      //   required: [true, "Please Provide Email"],
    },
    gender: {
      type: String,
      //   required: [true, "Please Provide gender"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobData", jobDataSchema);
