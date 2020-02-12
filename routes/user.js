const express = require("express");
const router = express.Router();
const userModel = require("../models/User.model");
const poiModel = require("../models/Poi.model");
const bcryptjs = require("bcryptjs");
const protectRoute = require("../middlewares/protectRoute");

// TODO
// /user/profile ( update password, preferences, deleted account)
// /user/poi/all ( show all the user's personnal pois )
// /user/poi/new
// /user/poi/edit/:id

///////////////////////
// USER PROFIL & UPDATE
///////////////////////

router.get("/profile/:id", protectRoute, (req, res, next) => {
  res.render("user/profile", { user: req.session.currentUser, scripts: ["user"] });
});

router.get("/password-edit/:id", protectRoute, (req, res, next) => {
  res.render("user/password-edit", { user: req.session.currentUser, scripts: ["user"] });
});

//profile update : password
router.post("/password-edit/:id", protectRoute, (req, res, next) => {
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
              req.flash("success", "password updated");
              res.redirect("/user/profile/" + req.params.id);
            })
            .catch(next);
        }
        //current password nok
        else {
          req.flash("error", "current password invalid");
          res.redirect("user//password-edit/" + req.params.id);
        }
      })
      .catch(next);
  } else {
    req.flash("error", "new password mismatch, please type it again");
    res.redirect("user//password-edit/" + req.params.id);
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

// //profile update : data (preferences)
// router.post("/profile/data/:id", checkLoginStatus, (req, res, next) => {
//   const { preferences } = req.body;

//   userModel
//     .findByIdAndUpdate(req.params.id, {
//       preferences
//     })
//     .then(() => {
//       req.flash("success", "sneaker successfully added");
//       res.redirect("/user/profile");
//     })
//     .catch(next);
// });

////////////////
// USER POI CRUD
////////////////

// CREATE

router.get("/poi/new/:id", (req, res, next) => {
  var categoryList = poiModel.schema.path("category").enumValues;
  //correction de la category list pour affichage propre aux utilisateurs
  categoryList = categoryList.map(cat => {
    if (cat == "resto_michelin") {
      cat = "Michelin Restaurants"
    }
    else if (cat == "resto_etoile") {
      cat = "Starred Restaurants"
    } 
    return cat
  });
  res.render("user/poi_new", { id: req.params.id, categoryList, scripts: ["user"] });
});

router.post("/poi/new/:id", (req, res, next) => {
  var { title, description, image, category, address, url, details } = req.body;

  //correction de la catégorie corrigée
  if (category == "Michelin") {
    category = "resto_michelin"
  }
  else if (category == "Starred") {
    category = "resto_etoile"
  } 

  poiModel
    .create({
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

    .then(results => {
      req.flash("success", "poi successfully created");
      res.redirect("/user/poi/all/" + req.params.id);
    })
    .catch(next);
});

// READ ALL ( show all the user's personnal pois )

router.get("/poi/all/:id", protectRoute, (req, res, next) => {
  poiModel
    .find({ user_id: req.params.id })
    .then(userPois => {
      res.render("user/poi_all", { userPois, idUser: req.params.id, isMultiple: true, scripts: ["user"] });
    })
    .catch(next);
});

// READ ONE ( show one of the user's personnal pois )

router.get("/poi/:id/:id_poi", protectRoute, (req, res, next) => {
  poiModel
    .findOne({ _id: req.params.id_poi })
    .then(userPoi => {
      res.render("user/poi_all", { userPois: [userPoi], idUser: req.params.id, scripts: ["user"] });
    })
    .catch(next);
});

// UPDATE

router.get("/poi/edit/:id/:id_poi", protectRoute, (req, res, next) => {
  var categoryList = poiModel.schema.path("category").enumValues;

  //correction de la category list pour affichage propre aux utilisateurs
  categoryList = categoryList.map(cat => {
    if (cat == "resto_michelin") {
      cat = "Michelin Restaurants"
    }
    else if (cat == "resto_etoile") {
      cat = "Starred Restaurants"
    } 
    return cat
  });


  poiModel
    .findOne({ _id: req.params.id_poi })
    .then(poi => {
      //correction de la catégorie du POI pour être gérée dans le helper selectedCat
      if (poi.category == "resto_michelin") {
        var categoryPoi = "Michelin Restaurants"
      }
      else if (poi.category == "resto_etoile") {
        var categoryPoi = "Starred Restaurants"
      } 
      res.render("user/poi_edit", { poi, idUser: req.params.id, categoryList, categoryPoi, scripts: ["user"] });
    })
    .catch(next);
});

<<<<<<< HEAD
router.post("/poi/edit/:id/:id_poi", protectRoute, (req, res, next) => {

  var { title, description, image, category, address, url, details } = req.body;

  //correction de la catégorie corrigée
  if (category == "Michelin") {
    category = "resto_michelin"
  }
  else if (category == "Starred") {
    category = "resto_etoile"
  } 

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

    .then(results => {
      req.flash("success", "poi successfully updated");
      res.redirect("/user/poi/all/" + req.params.id);
    })
    .catch(next);
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
