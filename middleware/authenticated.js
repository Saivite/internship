const isLoggedIn = (req, res, next) => {
  //   console.log(req.user);
  //   console.log(req.path, req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in to do that");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;
