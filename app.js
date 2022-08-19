const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const connectDB = require("./db/connect");
const AllJob = require("./models/allJob");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
