require("dotenv").config();
require("./config/mongodb"); // database initial setup

// base dependencies
const express = require("express");
const hbs = require("hbs");
const app = express();
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");

// initial config
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", require("./routes/index"));
app.use(require("./routes/auth"));
app.use("/user", require("./routes/user"));

// export the app (check import ./bin/www)
module.exports = app;
