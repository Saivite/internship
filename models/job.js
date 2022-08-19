const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    email: {
      type: String,
      //   required: [true, "Please Provide Email"],
      //   // creates a validator that checks if the value matches the given regular expression
      //   match: [
      //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      //   ],
    },
    mobile: {
      type: Number,
      //   required: [true, "Please Provide Email"],
    },
    gender: {
      type: String,
      //   required: [true, "Please Provide gender"],
    },
    appliedIn: {
      type: mongoose.Types.ObjectId,
      ref: "allJob",
    },
    // createdBy: {
    //   //tieing job model to the user one
    //   type: mongoose.Types.ObjectId,
    //   //tie job to the user
    //   ref: "User",
    //   required: [true, "Please provide user"],
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", JobSchema);
