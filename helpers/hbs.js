const hbs = require("hbs");

hbs.registerHelper("selectedCat", (catRadio,catPoi) => {
  if (catRadio==catPoi) {
    return `<option selected value=${catRadio}>${catRadio}</option>`
  }
  else {
    return `<option value=${catRadio}>${catRadio}</option>`
  } 

})