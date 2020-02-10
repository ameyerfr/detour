const express = require("express");
const router = express.Router();
const poiModel = require("../models/Poi.model");

// READ ALL


// READ ALL ( show all the user's personnal pois ) 

router.get("/all", (req, res, next) => {
    poiModel
    .find()
    .then(userPois => {
        res.render("pois/poi_all", {userPois});
    })
    .catch(next);
});


// READ ONE ( show one of the user's personnal pois ) 

router.get("/:id_poi", (req, res, next) => {
    poiModel
    .findOne({_id: req.params.id_poi})
    .then(poi => {
        res.render("pois/poi_one", {poi});
    })
    .catch(next);
});



module.exports = router;