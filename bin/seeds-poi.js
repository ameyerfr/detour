const poiModel = require("../models/Poi.model")
const mongoose = require('mongoose');

//data to insert
const poi = require('./data/michelinFinal.json')

mongoose
    .connect('mongodb://localhost/detour', {
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
