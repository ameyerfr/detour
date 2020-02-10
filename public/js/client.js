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
            <span class="poi-title">${data.title}</span>
        </a>
        <div class="poi-details is-hidden is-size-7">
            <div>
                <p>${data.description}</p>
                <p>${data.address}</p>
                <p>Lat: ${data.coordinates.lat}, Lng: ${data.coordinates.lng}</p>
            </div>
            <a href="#" class="button is-small">Recompute Direction</a>
        </div>
  `;
    const itemEl = document.createElement("div");
    itemEl.className = "poi-item";
    itemEl.innerHTML = itemTplHTML;
    target.appendChild(itemEl);
    itemEl.addEventListener("click", expandItem);
  }

  function expandItem(e) {
    const allItems = document.querySelectorAll(".poi-details");
    allItems.forEach(item => item.classList.add("is-hidden"));
    e.target
      .closest(".poi-item")
      .querySelector(".poi-details")
      .classList.remove("is-hidden");
  }
})();
