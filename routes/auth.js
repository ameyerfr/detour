const express = require("express");
const router = express.Router();
const userModel = require("../models/User.model");
const poiModel = require("../models/Poi.model");
const bcryptjs = require("bcryptjs");


////////////////////
// REGISTER / SIGNUP
////////////////////

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", (req, res) => {

  const user = req.body

  if (!user.email || !user.password || !user.name || !user.lastname) {
    req.flash("error", "no empty fields here please");
    res.redirect("/register");
    return;
  }
  else {
    userModel
      .findOne({
          email: user.email
      })
      .then(dbRes => {
          if (dbRes) {
              req.flash("error", "sorry, email is already taken");
              return res.redirect("/register");
          }

          const salt = bcryptjs.genSaltSync(10);
          const hashed = bcryptjs.hashSync(user.password, salt);
          user.password = hashed;

          userModel.create(user).then(() => res.redirect("/user/poi/all"));
      })
      .catch(next);
  }
});


/////////////////
// LOGIN / SIGNIN
/////////////////

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {

  const user = req.body;

  if (!user.email || !user.password) {
    req.flash("error", "wrong credentials");
    return res.redirect("/login");
  }

  userModel
    .findOne({ email: user.email })
    .then(dbRes => {
      if (!dbRes) {
        req.flash("error", "wrong credentials");
        return res.redirect("/login");
      }

      if (bcryptjs.compareSync(user.password, dbRes.password)) {
        const { _doc: clone } = { ...dbRes }; 
        delete clone.password;

        req.session.currentUser = clone;
        return res.redirect("/user/poi/all");
      } else {
        req.flash("error", "wrong credentials");
        return res.redirect("/login");
      }
    })
    .catch(next);
});


module.exports = router;
