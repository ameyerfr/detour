const express = require("express");
const router = express.Router();
const userModel = require("../models/User.model");
const poiModel = require("../models/Poi.model");
const bcryptjs = require("bcryptjs");

// TODO
// /user/profile ( update password, preferences, deleted account) 
// /user/poi/all ( show all the user's personnal pois ) 
// /user/poi/new 
// /user/poi/edit/:id


router.get("/profil", (req, res, next) => {
    res.render("user/profil");
  });
  

//profil update : password 
router.post("/profil/password/:id", (req, res, next) => {

    const { password } = req.body;
    const salt = bcryptjs.genSaltSync(10);
    const hashed = bcryptjs.hashSync(password, salt);

    userModel
        .findByIdAndUpdate(req.params.id, {
            password: hashed
        })
        .then(() => {
            req.flash("success", "password updated");
            res.redirect("/dashboard")
        })
        .catch(next);

})

//profil update : data (preferences) 
router.post("/profil/data/:id", (req, res, next) => {

    const {
        preferences
    } = req.body;

    userModel
        .findByIdAndUpdate(req.params.id, {
            preferences
        })
        .then(() => {
            req.flash("success", "sneaker successfully added");
            res.redirect("/dashboard")
        })
        .catch(next);
})


//profil delete
router.post("/profil/delete/:id", (req, res, next) => {
    userModel
    .findByIdAndDelete(req.params.id)
        .then(dbRes => {
            console.log("User account deleted", dbRes);
            res.redirect("/dashboard");
        })
        .catch(next);
})

module.exports = router;