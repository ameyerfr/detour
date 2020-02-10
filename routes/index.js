const express = require("express");
const router = express.Router();
const userModel = require("../models/User.model");
const poiModel = require("../models/Poi.model");
const bcryptjs = require("bcryptjs");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/alex-test", (req, res) => {
  res.render("alex-test", { modules: ["alex"], gmapsk: process.env.GMAPS_KEY });
});

module.exports = router;
