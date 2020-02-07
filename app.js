require("dotenv").config();
require("./config/mongodb"); // database initial setup

// base dependencies
const express = require("express");
const hbs = require("hbs");
const app = express();
const mongoose = require("mongoose");

// initial config
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes
app.use("/", require("./routes/index"));

// export the app (check import ./bin/www)
module.exports = app;
