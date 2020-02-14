const hbs = require("hbs");

hbs.registerHelper("selectedCat", (catList, catPoi) => {
  if (catList == catPoi) {
    return `<option selected value=${catList}>${catList}</option>`;
  } else {
    return `<option value=${catList}>${catList}</option>`;
  }

  //return `<option value=${catList} ${catList === catPoi ? "selected" : ""}>${catList}</option>`;
});
