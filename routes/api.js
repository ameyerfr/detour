const express = require("express");
const router = express.Router();
const poiModel = require("../models/Poi.model");
const defaultRadius = 20000; // default search circle in meters

router.post("/poi/list", (req, res, next) => {

  if (!req.body || !req.body.coordinates) {
    res.json({error : 'Wrong query parameters'})
    return;
  }

  const coordList = req.body.coordinates;

  // Construct a list of OR closes
  // To find POIs around each coordinate
  orGeoLIST = [];
  queryRadius  = req.body.radius || defaultRadius;
  queryRadiusRAD  = queryRadius / 1000 / 6371; // Convert in Radians
  coordList.forEach(coord => {
    orGeoLIST.push({ location : { $geoWithin: { $centerSphere: [ [coord.lng, coord.lat], queryRadiusRAD] } } })
  })

  // Construct a list of OR closes
  orUserLIST = [];
  // If user_id present, return all general pois in area + user's pois
  if (req.session.currentUser) {
    orUserLIST.push(
      {user_id : {$exists: false}},
      {user_id : {$exists: true, $eq: null}},
      {user_id : {$exists: true, $eq: req.session.currentUser._id }}
    )
  }
  //  return only general pois in area
  else {
    // Where user_id field is not present
    // Or user_id = null
    orUserLIST.push(
      {user_id : {$exists: false}},
      {user_id : {$exists: true, $eq: null}}
    )
  }

  // Construct AND with nested OR query
  const dbQuery = {
    $and : [
      {$or : orGeoLIST},
      {$or : orUserLIST}
    ]
  }

  // Optional categories
  if ( req.body.categories && req.body.categories.length > 0) {
     orCategoryList = []
     req.body.categories.forEach(cat => {
       orCategoryList.push({category : {$eq : cat}})
     })
     dbQuery.$and.push({$or : orCategoryList})
  }

  poiModel.find(dbQuery).then(results => {
    res.json({
      pois : results,
      total : results.length
    })
  }).catch(next)

})

module.exports = router;
