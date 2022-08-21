const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const EmployeeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    is_admin: {
      type: Number,
      default: 0,
    },
    jobApplied: [
      {
        type: Schema.Types.ObjectId,
        ref: "AllJob",
      },
    ],
    jobsData: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobData",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//it pass methods to plugin which auto adds username, password, make sure those usernames are unique and give some additional methods
EmployeeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Employee", EmployeeSchema);
