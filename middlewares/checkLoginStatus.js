module.exports = function checkLoginStatus(req, res, next) {
  if (req.session.currentUser) {
    res.locals.isLoggedIn = true;
    res.locals.user_id = req.session.currentUser._id;
  }
  console.log("res.locals.isLoggedIn", res.locals.isLoggedIn ? true : false);
  console.log("res.locals.user_id", res.locals.user_id);
  next();
};
