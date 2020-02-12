module.exports = function(req, res, next) {
  if (req.params.id === res.locals.user_id) {
    next();
  } else {
    req.flash("error", "You are not authorized to access this page");
    res.redirect("/user/poi/all/" + req.session.currentUser._id);
  }
};
