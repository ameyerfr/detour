const express = require("express");
const router = express.Router();
const axios = require('axios');


function slugify(string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }
  
  /////////////////////////////////////
  // GEOCACHING FOR CREATE & UPDATE POI
  /////////////////////////////////////
  
  router.get("/:address", (req, res) => {
      console.log(req.params.address)
    axios.get("https://maps.googleapis.com/maps/api/geocode/json?&address=" + slugify(req.params.address) + "&key=" + process.env.GPLACES_KEY)
    .then(dbRes => {
      res.send({lat : dbRes.data.results[0].geometry.location.lat, lng : dbRes.data.results[0].geometry.location.lng})
    })
    .catch(err => console.log(err))
  })

  module.exports = router;
