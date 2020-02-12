const express = require("express");
const router = express.Router();
const userModel = require("../models/User.model");
const poiModel = require("../models/Poi.model");
const bcryptjs = require("bcryptjs");
const protectRoute = require("../middlewares/protectRoute");
const axios = require('axios');

///////////////////////
// USER PROFIL & UPDATE
///////////////////////

router.get("/profile/:id", protectRoute, (req, res, next) => {
  res.render("user/profile", { user: req.session.currentUser, scripts: ["user", "notification"] });
});

//profile update : password
router.post("/profile/:id", protectRoute, (req, res, next) => {
  var current_pwd = req.body.current_pwd;
  var new_pwd1 = req.body.new_pwd1;
  var new_pwd2 = req.body.new_pwd2;

  //password typing ok
  if (new_pwd1 == new_pwd2) {
    userModel
      .findOne({ _id: req.session.currentUser._id })
      .then(user => {
        //current password ok
        if (bcryptjs.compareSync(current_pwd, user.password)) {
          const salt = bcryptjs.genSaltSync(10);
          const hashed = bcryptjs.hashSync(new_pwd1, salt);

          userModel
            .findByIdAndUpdate(req.params.id, {
              password: hashed
            })
            .then(() => {
              req.flash("success", "Password updated.");
              res.redirect("/user/profile/" + req.params.id);
            })
            .catch(next);
        }
        //current password nok
        else {
          req.flash("error", "Current password invalid.");
          res.redirect("/user/profile/" + req.params.id);
        }
      })
      .catch(next);
  } else {
    req.flash("error", "New password mismatch, please retry.");
    res.redirect("/user/profile/" + req.params.id);
  }
});

//account delete
router.get("/delete/:id", protectRoute, (req, res, next) => {
  userModel
    .findByIdAndDelete(req.params.id)
    .then(dbRes => {
      res.redirect("/register");
    })
    .catch(next);
});

////////////////
// USER POI CRUD
////////////////

// CREATE

router.get("/poi/new/:id", (req, res, next) => {
  var categoryList = poiModel.schema.path("category").enumValues;
<<<<<<< HEAD
  res.render("user/poi_new", { id: req.params.id, categoryList, scripts: ["user", "notification"] });
=======
  res.render("user/poi_new", { id: req.params.id, categoryList, gplacesk: process.env.GPLACES_KEY, scripts: ["user"] });
>>>>>>> 76c27ea48e99aa18403e9cca1cc012caf92f9404
});

router.post("/poi/new/:id", (req, res, next) => {
  var { title, description, image, category, address, url, details } = req.body;

  //correction de la catégorie
  if (category == "Michelin") {
    category = "Michelin Restaurants";
  } else if (category == "Starred") {
    category = "Starred Restaurants";
  }
<<<<<<< HEAD
=======
  else if (category == "Starred") {
    category = "Starred Restaurants"
  }
    
  axios.get("https://maps.googleapis.com/maps/api/geocode/json?&address=" + address + "&key=" + process.env.GPLACES_KEY)
  .then(dbRes => {
    var lat = dbRes.data.results[0].geometry.location.lat
    var lng = dbRes.data.results[0].geometry.location.lng
>>>>>>> 76c27ea48e99aa18403e9cca1cc012caf92f9404

    poiModel
    .create({
      title,
      description,
      image,
      category: category,
      coordinates: {
        lat: lat,
        lng: lng
      },
      location: {
        type: "Point",
        coordinates: [lng, lat]
      },
      address,
      user_id: req.params.id,
      url,
      details
    })
    .then(results => {
      req.flash("success", "poi successfully created");
      res.redirect("/user/poi/all/" + req.params.id);
    })
    .catch(next);
  })
  .catch(next)

});

// READ ALL ( show all the user's personnal pois )

router.get("/poi/all/:id", protectRoute, (req, res, next) => {
  poiModel
    .find({ user_id: req.params.id })
    .then(userPois => {
      res.render("user/poi_all", { userPois, idUser: req.params.id, isMultiple: true, scripts: ["user", "notification"] });
    })
    .catch(next);
});

// READ ONE ( show one of the user's personnal pois )

router.get("/poi/:id/:id_poi", protectRoute, (req, res, next) => {
  poiModel
    .findOne({ _id: req.params.id_poi })
    .then(userPoi => {
      res.render("user/poi_all", { userPois: [userPoi], idUser: req.params.id, scripts: ["user", "notification"] });
    })
    .catch(next);
});

// UPDATE

router.get("/poi/edit/:id/:id_poi", protectRoute, (req, res, next) => {
  var categoryList = poiModel.schema.path("category").enumValues;

  poiModel
    .findOne({ _id: req.params.id_poi })
    .then(poi => {
<<<<<<< HEAD
      res.render("user/poi_edit", { poi, idUser: req.params.id, categoryList, scripts: ["user", "notification"] });
=======
      res.render("user/poi_edit", { poi, idUser: req.params.id, categoryList, gplacesk: process.env.GPLACES_KEY, scripts: ["user"] });
>>>>>>> 76c27ea48e99aa18403e9cca1cc012caf92f9404
    })
    .catch(next);
});

router.post("/poi/edit/:id/:id_poi", protectRoute, (req, res, next) => {
  var { title, description, image, category, address, url, details } = req.body;

  //correction de la catégorie
  if (category == "Michelin") {
    category = "Michelin Restaurants";
  } else if (category == "Starred") {
    category = "Starred Restaurants";
  }

<<<<<<< HEAD
  console.log(category);

  poiModel
    .findByIdAndUpdate(req.params.id_poi, {
      title,
      description,
      image,
      category: category,
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
      url,
      details
    })
=======
  axios.get("https://maps.googleapis.com/maps/api/geocode/json?&address=" + address + "&key=" + process.env.GPLACES_KEY)
  .then(dbRes => {
    var lat = dbRes.data.results[0].geometry.location.lat
    var lng = dbRes.data.results[0].geometry.location.lng

    poiModel
      .findByIdAndUpdate(req.params.id_poi, {
        title,
        description,
        image,
        category: category,
        coordinates: {
          lat: lat,
          lng: lng
        },
        location: {
          type: "Point",
          coordinates: [lng, lat]
        },
        address,
        user_id: req.params.id,
        url,
        details
      })
>>>>>>> 76c27ea48e99aa18403e9cca1cc012caf92f9404

      .then(results => {
        req.flash("success", "poi successfully updated");
        res.redirect("/user/poi/all/" + req.params.id);
      })
      .catch(next);
    })
    .catch(next)
});

// DELETE
router.delete("/poi/delete/:id/:id_poi", protectRoute, (req, res, next) => {
  poiModel
    .findByIdAndDelete(req.params.id_poi)
    .then(dbRes => {
      res.json("/user/poi/all/" + req.params.id);
    })
    .catch(err => res.json({ error: err }));
});

module.exports = router;
