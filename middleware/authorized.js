function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin === 1) {
    return next();
  }
  req.flash("error", "You are not an admin.");
  const redirectUrl = req.session.returnTo || "/jobs";
  delete req.session.returnTo;
  return res.redirect(redirectUrl);
}

module.exports = isAdmin;
