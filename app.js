const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const connectDB = require("./db/connect");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const AllJob = require("./models/allJob");
const JobData = require("./models/jobData");
// const Joi = require("joi");
const { allJobSchema, jobDataSchema } = require("./schema");
const methodOverride = require("method-override");
//engine that is used to run, parse and make sense of ejs
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
//pass query string and it allows browser to send put, patch , update , delete request etc from form
app.use(methodOverride("_method"));

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

const validateJobData = (req, res, next) => {
  const { error } = jobDataSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
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

app.get(
  "/jobs/:id",
  catchAsync(async (req, res) => {
    const job = await AllJob.findById(req.params.id).populate("jobsData");
    console.log(job);
    res.render("jobs/show", { job });
  })
);

app.get(
  "/jobs/:id/apply",
  catchAsync(async (req, res) => {
    const job = await AllJob.findById(req.params.id);
    res.render("jobs/new", { job });
  })
);

app.post(
  "/jobs/:id/",
  validateJobData,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const job = await AllJob.findById(id);
    const jobData = new JobData(req.body.jobData);
    console.log(req.body.jobData);
    job.jobsData.push(jobData);
    await jobData.save();
    await job.save();
    res.redirect(`/jobs/${job._id}`);
  })
);

// app.get(
//   "/jobs/:id/edit",
//   catchAsync(async (req, res) => {
//     const job = await JobData.findById(req.params.id);
//     res.render("jobs/edit", { job });
//   })
// );

// app.put(
//   "/jobs/:id",
//   catchAsync(async (req, res) => {
//     res.send("Update worked");
//   })
// );

//******************* ADMIN PART ************** */

app.get(
  "/admin/AllJobs",
  catchAsync(async (req, res) => {
    const jobs = await AllJob.find({});
    res.render("admin-jobs/admin_index", { jobs });
  })
);

app.get(
  "/admin/AllJobs/new",
  catchAsync(async (req, res) => {
    res.render("admin-jobs/admin_new");
  })
);

app.post(
  "/admin/AllJobs/",
  validateAllJob,
  catchAsync(async (req, res) => {
    // if (!req.body.AllJob)
    // throw new ExpressError("Invalid Campground Data", 400);
    const job = new AllJob(req.body.AllJob);
    await job.save();
    res.redirect(`/admin/AllJobs/${job._id}`);
  })
);

app.get(
  "/admin/AllJobs/:id",
  catchAsync(async (req, res) => {
    const job = await AllJob.findById(req.params.id).populate("jobsData");
    res.render("admin-jobs/admin_show", { job });
  })
);

app.get(
  "/admin/AllJobs/:id/edit",
  catchAsync(async (req, res) => {
    const job = await AllJob.findById(req.params.id);
    res.render("admin-jobs/admin_edit", { job });
  })
);

app.put(
  "/admin/AllJobs/:id",
  validateAllJob,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const job = await AllJob.findByIdAndUpdate(id, { ...req.body.AllJob });
    res.redirect(`/admin/AllJobs/${job._id}`);
  })
);

app.delete(
  "/admin/AllJobs/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const job = await AllJob.findByIdAndDelete(id);
    res.redirect("/admin/AllJobs");
  })
);

app.get("/admin/AllJobs/:id/jobInfo", async (req, res) => {
  const { id } = req.params;
  const job = await AllJob.findById(id).populate("jobsData");

  res.render("admin-jobs/admin_list", { job });
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is starting at port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
