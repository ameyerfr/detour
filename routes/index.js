const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/detour", (req, res) => {
  res.render("detour", { scripts: ["detour"], gmapsk: process.env.GMAPS_KEY });
});

router.get("/alex-test", (req, res) => {
  res.render("alex-test", { gmapsk: process.env.GMAPS_KEY });
});

module.exports = router;
