import APIHandler from "./APIHandler.js";
const detour = new APIHandler("http://localhost:8000/api");

(async function() {
  const pois = await detour.getPOIList();
  console.log(pois.data);
  renderList(pois.data.pois, "poi-list");

  function renderList(data, target) {
    const poiList = document.getElementById(target);
    if (!poiList) return;
    poiList.innerHTML = ""; // clear list
    data.forEach(element => {
      // loop through data and render each item
      renderItem(element, poiList);
    });
  }

  function renderItem(data, target) {
    const itemTplHTML = `
        <a class="panel-block">
        <span class="panel-icon">
            <i class="fas fa-eye" aria-hidden="true"></i>
        </span>
        ${data.title}
        </a>
  `;
    const itemTpl = document.createElement("template");
    itemTpl.innerHTML = itemTplHTML;
    const itemEl = itemTpl.content.cloneNode(true);
    target.appendChild(itemEl);
  }
})();
