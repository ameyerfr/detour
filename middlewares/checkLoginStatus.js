module.exports = function checkLoginStatus(req, res, next) {
  if (req.session.currentUser) {
    res.locals.isLoggedIn = true;
    res.locals.user_id = req.session.currentUser._id;
  }
  // console.log("Logged status:", res.locals.isLoggedIn ? "Is logged" : "Is not logged");
  // console.log("User id:", res.locals.user_id);
  next();
};
