const userModel = require("../models/User.model")
const mongoose = require('mongoose');
const bcryptjs = require("bcryptjs");


var salt = bcryptjs.genSaltSync(10);
var hashed = bcryptjs.hashSync("toto", salt);
password1 = hashed;

salt = bcryptjs.genSaltSync(10);
hashed = bcryptjs.hashSync("toto", salt);
password2 = hashed;


//data to insert
users = [
    {
        email: "pascal@gmail.com",
        password: password1
    },
    {
        email: "ant@gmail.com",
        password: password2
    }
]

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

userModel
    .insertMany(users)
    .then(dbSuccess => {
        console.log("users inserted successfully", dbSuccess)
    })
    .catch(dbErr => {
        console.log("oh no, error connecting to mongo", dbErr)
    });
