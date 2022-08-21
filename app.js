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
const session = require("express-session");
const flash = require("connect-flash");

const adminRoutes = require("./routes/admin");
const jobRoutes = require("./routes/jobs");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
//pass query string and it allows browser to send put, patch , update , delete request etc from form
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: Date.now() * 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

//Middlewares - do it before route handler
app.use((req, res, next) => {
  //it will give access to success in any of the template
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//router
app.use("/admin", adminRoutes);
app.use("/", jobRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

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

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//custom error

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
