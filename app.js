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

app.get("/newJob", async (req, res) => {
  const newJob = new AllJob({
    title: "backend",
    description: "backend developer in xyz",
    location: "bangalore",
    eligible: "experience of  5 years required",
  });
  await newJob.save();
  res.send(newJob);
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
