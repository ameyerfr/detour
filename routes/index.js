const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/detour", (req, res) => {
  res.render("detour", { scripts: ["detourRoutes", "detour", "app"], gmapsk: process.env.GMAPS_KEY, axios : true });
});

module.exports = router;
