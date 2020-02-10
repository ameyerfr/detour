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


///////////////////////
// USER PROFIL & UPDATE
///////////////////////

router.get("/profile", (req, res, next) => {
    res.render("user/profile");
});


//profile update : password
router.post("/profile/password/:id", (req, res, next) => {

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

//profile update : data (preferences)
router.post("/profile/data/:id", (req, res, next) => {

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


//profile delete
router.post("/profile/delete/:id", (req, res, next) => {
    userModel
    .findByIdAndDelete(req.params.id)
        .then(dbRes => {
            console.log("User account deleted", dbRes);
            res.redirect("/dashboard");
        })
        .catch(next);
})


////////////////
// USER POI CRUD
////////////////


// READ /user/poi/all ( show all the user's personnal pois )

router.get("/user/:id/poi/all", (req, res, next) => {
    poiModel
    .find({user_id: req.param.id})
    .then(userPois => {
        res.render("user/pois", {userPois});
    })
    .catch(next);
});


// /user/poi/new
// CREATE /user/poi/all ( show all the user's personnal pois )

router.get("/user/:id/poi/new", (req, res, next) => {
    res.render("user/pois/new")
});

router.post("/user/:id/poi/new", (req, res, next) => {

    const {
        title,
        description,
        image,
        address,
        url,
        details
    } = req.body

    poiModel
    .create({title, description, image,
        coordinates: {
            lat: req.body.lat,
            lng: req.body.lng
        },
        location: {
            type: "Point",
            coordinates: [req.body.lng, req.body.lat]
        },
        address,
        user_id: req.params.id,
        url, details})

    .then( results => {
        req.flash("success", "poi successfully created")
        res.redirect("/user/" + req.params.id + "/poi/all")
    })
    .catch(next);

});

// /user/poi/new

module.exports = router;
