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
            res.redirect("/user/profile")
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
            res.redirect("/user/profile")
        })
        .catch(next);
})



//profile delete
router.post("/profile/delete/:id", (req, res, next) => {
    userModel
    .findByIdAndDelete(req.params.id)
        .then(dbRes => {
            console.log("User account deleted", dbRes);
            res.redirect("/register");
        })
        .catch(next);
})




////////////////
// USER POI CRUD
////////////////

// CREATE

router.get("/poi/new/:id", (req, res, next) => {
    res.render("user/poi_new", {id:req.params.id})
});


router.post("/poi/new/:id", (req, res, next) => {

    const {
        title,
        description,
        image,
        address,
        url,
        details
    } = req.body

    if (req.body.Museums === 'on') {
        var category = "Museums";
    }
    else if (req.body.Friends === 'on') {
        var category = "Friends";
    }

    poiModel
    .create({title, description, image, category,
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

// READ ALL ( show all the user's personnal pois ) 

router.get("/poi/all/:id", (req, res, next) => {
    poiModel
    .find({user_id: req.params.id})
    .then(userPois => {
        res.render("user/poi_all", {userPois, idUser:req.params.id, isMultiple: true});
    })
    .catch(next);
});


// READ ONE ( show one of the user's personnal pois ) 

router.get("/poi/:id/:id_poi", (req, res, next) => {

    poiModel
    .findOne({_id: req.params.id_poi})
    .then(userPoi => {
        res.render("user/poi_all", {userPois:[userPoi], idUser:req.params.id});
    })
    .catch(next);
});




// UPDATE

router.get("/poi/edit/:id/:id_poi", (req, res, next) => {
    poiModel
    .findOne({_id: req.params.id_poi})
    .then(poi => {
        res.render("user/poi_edit", {poi, idUser:req.params.id});
    })
    .catch(next);
});


router.post("/poi/edit/:id/:id_poi", (req, res, next) => {
    
    const {
        title, 
        description, 
        image,
        address,
        url,
        details
    } = req.body

    if (req.body.Museums === 'on') {
        var category = "Museums";
    }
    else if (req.body.Friends === 'on') {
        var category = "Friends";
    }

    poiModel
    .findByIdAndUpdate(req.params.id_poi,
        {title, description, image, category,
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

    .then(results => {
        req.flash("success", "poi successfully updated")
        res.redirect("/user/poi/all/" + req.params.id)
    })
    .catch(next);

});


// DELETE
router.get("/poi/delete/:id/:id_poi", (req, res, next) => {
    
    poiModel
    .findByIdAndDelete(req.params.id_poi)
        .then(dbRes => {
            res.redirect("/user/poi/all/" + req.params.id);
        })
        .catch(next);
})

module.exports = router;
