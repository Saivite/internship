const express = require("express");
const passport = require("passport");
const isLoggedIn = require("../middleware/authenticated");
const router = express.Router();
const Employee = require("../models/employee");
const catchAsync = require("../utils/catchAsync");

/*************** ADMIN ********** */

router.get("/admin/register", (req, res) => {
  res.render("employees/register");
});

router.post(
  "/admin/register",
  catchAsync(async (req, res) => {
    try {
      const { email, is_admin, username, password } = req.body;
      const employee = new Employee({ email, is_admin, username });
      const registeredEmployee = await Employee.register(employee, password);
      //it allows to login a user after it has registered
      req.login(registeredEmployee, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to TATA STEEL");
        if (Number(is_admin) === 1) {
          res.redirect("admin/AllJobs");
        } else {
          res.redirect("/jobs");
        }
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/register");
    }
  })
);

/******************Employee ********** */
router.get("/login", (req, res) => {
  res.render("employees/employee-login");
});

router.post(
  "/login",
  //provides a middleware
  passport.authenticate("local", {
    failureFlash: true, //failure message if there is a failure
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = req.session.returnTo || "/jobs";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  //provided by passport
  req.logout(async function (err) {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "GoodBye!!");
      res.redirect("/jobs");
    }
  });
});

module.exports = router;
