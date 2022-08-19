const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const connectDB = require("./db/connect");
const AllJob = require("./models/allJob");
const Job = require("./models/job");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
//pass query string and it allows browser to send put, patch , update , delete request etc from form
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/jobs", async (req, res) => {
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
});

app.get("/jobs/:id", async (req, res) => {
  const job = await AllJob.findById(req.params.id);
  res.render("jobs/show", { job });
});

app.get("/jobs/:id/apply", async (req, res) => {
  const job = await AllJob.findById(req.params.id);
  res.render("jobs/new", { job });
});

app.post("/jobs/:id", async (req, res) => {
  const applied_JobId = req.params.id;
  console.log(applied_jobId);
  const job = new Job(req.body.job);
  await job.save();
  const job_applied = await AllJob.findById(applied_JobId);
  console.log(job_applied);
  job_applied.hasApplied = true;
  res.redirect(`/jobs/${applied_JobId}`);
});

app.get("/jobs/:id/edit", async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.render("jobs/edit", { job });
});

app.put("/jobs/:id", async (req, res) => {
  res.send("Update worked");
});

//******************* ADMIN PART ************** */

app.get("/AllJobs", async (req, res) => {
  const jobs = await AllJob.find({});
  res.render("jobs/admin_index", { jobs });
});

app.get("/AllJobs/new", async (req, res) => {
  res.render("jobs/admin_new");
});

app.post("/AllJobs", async (req, res) => {
  const job = new AllJob(req.body.AllJob);
  await job.save();
  res.redirect(`/jobs/${job._id}`);
});

app.get("/AllJobs/:id", async (req, res) => {
  const job = await AllJob.findById(req.params.id);
  res.render("jobs/admin_show", { job });
});

app.get("/AllJobs/:id/edit", async (req, res) => {
  const job = await AllJob.findById(req.params.id);
  res.render("jobs/admin_edit", { job });
});

app.put("/AllJobs/:id", async (req, res) => {
  const { id } = req.params;
  const job = await AllJob.findByIdAndUpdate(id, { ...req.body.AllJob });
  res.redirect(`/jobs/${job._id}`);
});

app.delete("/AllJobs/:id", async (req, res) => {
  const { id } = req.params;
  const job = await AllJob.findByIdAndDelete(id);
  res.redirect("/AllJobs");
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
