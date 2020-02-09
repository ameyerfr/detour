const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/alex-test", (req, res) => {
  res.render("alex-test", {modules:["alex"], gmapsk:process.env.GMAPS_KEY});
});


module.exports = router;
