module.exports = function checkLoginStatus(req, res, next) {
  if (req.session.currentUser) {
    res.locals.isLoggedIn = true;
    res.locals.user_id = req.session.currentUser._id;
  }
  next();
};
