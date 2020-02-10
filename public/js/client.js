import APIHandler from "./APIHandler.js";
const detour = new APIHandler("http://localhost:8000/api");

(async function() {
  let pois = await detour.getPOIList();
  pois = pois.data.pois;
  const poiList = document.getElementById("poi-list");
  const searchInput = document.getElementById("search-poi");
  searchInput.addEventListener("input", searchByName);
  const searchCategory = document.getElementById("poi-categories");
  searchCategory.addEventListener("click", searchByCategory);
  renderList(pois);

  function renderList(data) {
    poiList.innerHTML = "";
    data.forEach(element => renderItem(element, poiList));
  }

  function renderItem(data) {
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
    poiList.appendChild(itemEl);
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

  function searchByName(e) {
    const query = e.target.value;
    const filteredPOIs = pois.filter(element => element.title.match(new RegExp(query, "i")));
    renderList(filteredPOIs);
  }

  function searchByCategory(e) {
    if (e.target.hasAttribute("data-category")) {
      console.log(e.target);
      const category = e.target.getAttribute("data-category");
      if (category === "all") {
        renderList(pois);
        return;
      }
      const filteredPOIs = pois.filter(element => element.category === category);
      renderList(filteredPOIs);
    }
  }
})();
