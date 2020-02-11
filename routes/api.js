const express = require("express");
const router = express.Router();
const poiModel = require("../models/Poi.model");
const defaultRadius = 20000; // default search circle in meters

router.get("/poi/query", (req, res, next) => {

    const dbQuery = {}

    if (!req.query || !req.query.lat || !req.query.lng) {
      res.json({error : 'Wrong query parameters'})
      return;
    }

    dbQuery.location = {
     $nearSphere: {
      $maxDistance: req.query.radius || defaultRadius,
      $geometry: { type: "Point", coordinates: [req.query.lng, req.query.lat] }
     }
    }

    // If user_id present, return all general pois in area + user's pois
    if (req.query.user_id ) {
      dbQuery.$or = [
        {user_id : {$exists: false}},
        {user_id : {$exists: true, $eq: null}},
        {user_id : {$exists: true, $eq: req.query.user_id }}
      ]
    }
    //  return only general pois in area
    else {
      // Where user_id field is not present
      // Or user_id = null
      dbQuery.$or = [
        {user_id : {$exists: false}},
        {user_id : {$exists: true, $eq: null}}
      ]
    }

    poiModel.find(dbQuery).then(results => {
      res.json({
        pois : results,
        total : results.length
      })
    }).catch(next)

});

router.post("/poi/list", (req, res, next) => {

  if (!req.body || !req.body.coordinates) {
    res.json({error : 'Wrong query parameters'})
    return;
  }

  const coordList = req.body.coordinates;

  mongoGEOList = [];
  queryRadius  = req.body.radius || defaultRadius;
  queryRadiusRAD  = queryRadius / 1000 / 6371; // Convert in Radians
  coordList.forEach(coord => {
    mongoGEOList.push({ location : {
        $geoWithin: { $centerSphere: [ [coord.lng, coord.lat], queryRadiusRAD] }
      } } )
  })

  const dbQuery = {$or : mongoGEOList}

  poiModel.find(dbQuery).then(results => {
    res.json({
      pois : results,
      total : results.length
    })
  }).catch(next)

})

module.exports = router;
