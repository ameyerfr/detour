require("dotenv").config();
require("./config/mongodb"); // database initial setup
require("./helpers/hbs"); // utils for hbs templates

// base dependencies
const express = require("express");
const hbs = require("hbs");
const app = express();
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo")(session);
const checkLoginStatus = require("./middlewares/checkLoginStatus.js");
const exposeFlashMessage = require("./middlewares/flashMessages");

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

// SESSION SETUP
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60000 }, // 1 day in millisec
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    saveUninitialized: true,
    resave: true
  })
);

app.use(flash());
app.use(checkLoginStatus);
app.use(exposeFlashMessage);

// Routes
app.use("/", require("./routes/index"));
app.use(require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/api", require("./routes/api"));
app.use("/poi", require("./routes/poi"));
app.use("/geocaching", require("./routes/geocaching"));

// export the app (check import ./bin/www)
module.exports = app;
