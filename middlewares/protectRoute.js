module.exports = function(req, res, next) {
  if (req.params.id === res.locals.user_id) {
    next();
  } else {
    req.flash("error", "You are not authorized to access the requested page. You've been redirect to your home page.");
    res.redirect("/user/poi/all/" + res.locals.user_id);
  }
};
