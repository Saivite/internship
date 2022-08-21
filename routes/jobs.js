const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
//mongooseu878
const AllJob = require("../models/allJob");
const JobData = require("../models/jobData");
const { allJobSchema, jobDataSchema } = require("../schema");

const validateJobData = (req, res, next) => {
  const { error } = jobDataSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/jobs",
  catchAsync(async (req, res) => {
    //   const newJob = new AllJob({
    //     title: "backend",
    //     description: "backend developer in xyz",
    //     location: "bangalore",
    //     eligible: "btech",
    //     experience: "5 years",
    //     payment: "50000",
    //     skills: "node js",
    //   });
    //   await newJob.save();
    //   res.send(newJob);
    const jobs = await AllJob.find({});
    res.render("jobs/index", { jobs });
  })
);

router.get(
  "/jobs/:id",
  catchAsync(async (req, res) => {
    const job = await AllJob.findById(req.params.id).populate("jobsData");
    if (!job) {
      req.flash("error", "Cant find the Job");
      return res.redirect("/admin/AllJobs");
    }
    res.render("jobs/show", { job });
  })
);

router.get(
  "/jobs/:id/apply",
  catchAsync(async (req, res) => {
    const job = await AllJob.findById(req.params.id);
    if (!job) {
      req.flash("error", "Cant find the Job");
      return res.redirect("/admin/AllJobs");
    }
    res.render("jobs/new", { job });
  })
);

router.post(
  "/jobs/:id/",
  validateJobData,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const job = await AllJob.findById(id);
    if (!job) {
      req.flash("error", "Cant find the Job");
      return res.redirect("/admin/AllJobs");
    }
    const jobData = new JobData(req.body.jobData);
    console.log(req.body.jobData);
    job.jobsData.push(jobData);
    await jobData.save();
    await job.save();
    req.flash("success", "Succesfully applied for Job");
    res.redirect(`/jobs/${job._id}`);
  })
);

module.exports = router;
