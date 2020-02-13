const poiModel = require("../models/Poi.model")
const mongoose = require('mongoose');
let fileToSeed = 'museumsFinal.json'; // default seed

// Ability to pass argument with the name of another json file to seed
if (process.argv && process.argv[2]) {
  fileToSeed = process.argv[2];
}

//data to insert
const poi = require('./data/' + fileToSeed)

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true
    })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });

poiModel
    .insertMany(poi)
    .then(dbSuccess => {
        console.log("pois inserted successfully", dbSuccess)
    })
    .catch(dbErr => {
        console.log("oh no, error connecting to mongo", dbErr)
    });
