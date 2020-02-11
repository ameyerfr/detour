import APIHandler from "./APIHandler.js";
const detour = new APIHandler("http://localhost:8000/api");

const getItineraryBtn = document.getElementById("get-itinerary-btn");
getItineraryBtn.onclick = getPOIs;
const searchInput = document.getElementById("search-poi");
searchInput.addEventListener("input", filterPOIs);
const searchCategory = document.getElementById("poi-categories");
searchCategory.addEventListener("click", searchByCategory);
const clearSearchBtn = document.getElementById("clear-search-btn");
clearSearchBtn.addEventListener("click", clearSearch);
const poiList = document.getElementById("poi-list");
let pois;

async function getPOIs() {
  pois = await detour.getPOIList();
  pois = pois.data.pois;
  renderList(pois);
}

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
            <a href="#" class="button is-small">Make a detour</a>
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

function searchByCategory(e) {
  if (e.target.hasAttribute("data-category")) {
    searchCategory.querySelectorAll("a").forEach(element => element.classList.remove("is-active"));
    e.target.classList.add("is-active");
    filterPOIs();
  }
}

function clearSearch(e) {
  searchInput.value = "";
  filterPOIs(pois);
}

function filterPOIs() {
  const textQuery = searchInput.value;
  const categoryQuery = searchCategory.querySelector(".is-active").getAttribute("data-category");
  const filteredPOIs = pois.filter(element => {
    if (categoryQuery === "all") return element.title.match(new RegExp(textQuery, "i"));
    return element.category === categoryQuery && element.title.match(new RegExp(textQuery, "i"));
  });
  renderList(filteredPOIs);
}
