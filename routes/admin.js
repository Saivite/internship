const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const AllJob = require("../models/allJob");
const { allJobSchema, jobDataSchema } = require("../schema");
const isLoggedIn = require("../middleware/authenticated");
const isAdmin = require("../middleware/authorized");

//******************* ADMIN PART ************** */

//Middlewares
const validateAllJob = (req, res, next) => {
  //this is not mongoose schema

  const { error } = allJobSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/AllJobs",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const jobs = await AllJob.find({});
    res.render("admin-jobs/admin_index", { jobs });
  })
);

router.get("/AllJobs/new", isLoggedIn, isAdmin, (req, res) => {
  res.render("admin-jobs/admin_new");
});

router.post(
  "/AllJobs/",
  isLoggedIn,
  isAdmin,
  validateAllJob,
  catchAsync(async (req, res) => {
    // if (!req.body.AllJob)
    // throw new ExpressError("Invalid Campground Data", 400);
    const job = new AllJob(req.body.AllJob);
    await job.save();
    req.flash("success", "Succesfully created a new Job");
    res.redirect(`/admin/AllJobs/${job._id}`);
  })
);

router.get(
  "/AllJobs/:id",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const job = await AllJob.findById(req.params.id).populate("jobsData");
    if (!job) {
      req.flash("error", "Cant find the Job");
      return res.redirect("/admin/AllJobs");
    }
    res.render("admin-jobs/admin_show", { job });
  })
);

router.get(
  "/AllJobs/:id/edit",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const job = await AllJob.findById(req.params.id);
    if (!job) {
      req.flash("error", "Cant find the Job");
      return res.redirect("/admin/AllJobs");
    }
    res.render("admin-jobs/admin_edit", { job });
  })
);

router.put(
  "/AllJobs/:id",
  isLoggedIn,
  isAdmin,
  validateAllJob,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const job = await AllJob.findByIdAndUpdate(id, { ...req.body.AllJob });
    if (!job) {
      req.flash("error", "Cant find the Job");
      return res.redirect("/admin/AllJobs");
    }
    req.flash("success", "Succesfully updated Job");
    res.redirect(`/admin/AllJobs/${job._id}`);
  })
);

router.delete(
  "/AllJobs/:id",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const job = await AllJob.findByIdAndDelete(id);
    if (!job) {
      req.flash("error", "Cant find the Job");
      res.redirect("/admin/AllJobs");
    }
    req.flash("success", "Succesfully deleted Job");
    res.redirect("/admin/AllJobs");
  })
);

router.get(
  "/AllJobs/:id/jobInfo",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const job = await AllJob.findById(id).populate("jobsData");
    if (!job) {
      req.flash("error", "Cant find the Job");
      return res.redirect("/admin/AllJobs");
    }
    res.render("admin-jobs/admin_list", { job });
  })
);
module.exports = router;
