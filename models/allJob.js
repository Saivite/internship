const mongoose = require("mongoose");
const JobData = require("./jobData");
const Schema = mongoose.Schema;

const AllJobSchema = new Schema(
  {
    position: String,
    location: String,
    businessHR: String,
    openingDate: Date,
    closingDate: Date,
    description: String,
    eligibility: String,
    payment: String,
    experience: String,
    skills: String,
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

//deleting jobData if admon deletes a job. Its a query middleware which pass a document once it finds it. Some other middleware which can acccess this keyword to refer to the document
AllJobSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await JobData.deleteMany({
      _id: {
        $in: doc.jobsData,
      },
    });
  }
});

module.exports = mongoose.model("AllJob", AllJobSchema);
