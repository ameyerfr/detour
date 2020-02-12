module.exports = function checkLoginStatus(req, res, next) {
  res.locals.isLoggedIn = Boolean(req.session.currentUser);
  console.log("----------", "is logged in?", res.locals.isLoggedIn);

  if (res.locals.isLoggedIn) {
    if (req.params.id == req.session.currentUser._id) {
      res.locals.user_id = req.session.currentUser._id;
      res.locals.message_success = req.flash("success", "Welcome on your POI page !");
    } else {
      res.locals.message_error = req.flash("error", "you don't have access to this page");
    }
  } else {
    res.redirect("/login");
  }
  next();
};
