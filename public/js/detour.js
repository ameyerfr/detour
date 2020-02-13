
const getItineraryBtn = document.getElementById("get-itinerary-btn");
getItineraryBtn.onclick = getPOIs;
// const searchInput = document.getElementById("search-poi");
// searchInput.addEventListener("input", filterPOIs);
// const searchCategory = document.getElementById("poi-categories");
// searchCategory.addEventListener("click", searchByCategory);
// const clearSearchBtn = document.getElementById("clear-search-btn");
// clearSearchBtn.addEventListener("click", initSearch);
const poiList = document.getElementById("poi-list");
const notificationContainer = document.getElementById("itinerary-notification");
let pois;

const inputFrom = document.getElementById("direction-from");
const inputTo = document.getElementById("direction-to");

const categoryListItems = document.getElementById("select-category").querySelectorAll("input[name]");
const categoryAllItem = document.getElementById("all-categories");

// Auto select categories when clicking ALL
categoryAllItem.onclick = selectAllCategories;
function selectAllCategories() {
  categoryListItems.forEach(element => {
    element.checked = categoryAllItem.checked ? true : false;
  });
}

// Unckecked ALL when unckecking any other value
categoryListItems.forEach((el, i) => {
  if (i > 0) {
    el.addEventListener("click", () => {
      if (!el.checked) categoryAllItem.checked = false;
    });
  }
});

// Return selected categories in array, except the ALL value
function getSelectedCategories() {
  let selectedCategories = [];
  categoryListItems.forEach((element, i) => {
    if (element.checked && i > 0) selectedCategories.push(element.name);
  });
  if (selectedCategories.length === categoryListItems.length - 1) selectedCategories = [];
  return selectedCategories;
}

async function getPOIs() {
  if (inputFrom.value === "" || inputTo.value === "") {
    notificationContainer.innerHTML = "Please fill the fields before searching !";
    return;
  }

  let directionRequest = {
    origin: { query: inputFrom.value },
    destination: { query: inputTo.value }
  };

  let selectedCategories = getSelectedCategories();

  try {

    let response = await window.DETOUR.routeHelper.generateRoute(directionRequest, selectedCategories);
    pois = response.pois;

    showMainMap();

    window.DETOUR.routeHelper.centerMapOnMarkers();

    displayItineraryDuration(response.duration);

    renderList(pois);

    // initSearch();

  } catch(error) {
    console.log(error);
    return;
  }

}

async function makeADetour(poi) {
  let response = await window.DETOUR.routeHelper.addStopOver(poi);
  console.log("Make a detour response : ", response);
  displayDetourDuration(response.duration);
}

function showMainMap() {
  document.getElementById('map').classList.remove("is-hidden");
}

function displayItineraryDuration(duration) {
  document.getElementById('itinerary-notification').classList.remove("is-hidden");
  let d = humanizeSecondsDuration(duration);
  notificationContainer.innerHTML = `
  <span id="base-duration">This route will take you : <span id="base-duration-value">${d}</span></span>
  <span id="detour-duration"></span>`;
}

function displayDetourDuration(duration) {
  let detourDuration = humanizeSecondsDuration(duration.detourDuration);
  let detourDiff = humanizeSecondsDuration(duration.diff);
  document.getElementById("base-duration-value").innerHTML = detourDuration;
  document.getElementById("detour-duration").innerHTML = `Detour : <span id="detour-duration-value">${detourDiff}</span>`;
}

function renderList(data) {
  poiList.innerHTML = "";
  data.forEach((element, index) => renderItem(element, index));
}

function renderItem(data, index) {
  const itemTplHTML = `
        <a class="panel-block">
            <span class="marker">
                ${index + 1}
            </span>
            <span class="poi-title">${data.title}</span>
        </a>
        <div class="poi-details is-hidden is-size-7">
        ${
          data.image
            ? `
          <div class="poi-image"><img src="${data.image}"></div>`
            : ""
        }
            <div class="poi-detail">
                  <p>${data.description}</p>
                  <p>${data.address}</p>
              </div>
            <div class="buttons poi-actions">
              <a class="button is-small is-fullwidth" href="https://www.google.com/maps/place/?q=place_id:${data.place_id}" target="_blank">View details</a>
              <a class="button is-small is-fullwidth is-primary">Make a detour</a>
            </div>
        </div>
  `;
  const itemEl = document.createElement("div");
  itemEl.setAttribute("data-poi-id", data._id);
  itemEl.className = "poi-item";
  itemEl.innerHTML = itemTplHTML;
  poiList.appendChild(itemEl);
  itemEl.addEventListener("click", onPoiItemClick);
}

function onPoiItemClick(e) {
  const allItems = document.querySelectorAll(".poi-details");

  // Toggle details
  allItems.forEach(item => item.classList.add("is-hidden"));
  e.target
    .closest(".poi-item")
    .querySelector(".poi-details")
    .classList.remove("is-hidden");

  // Make a Detour button
  if (e.target.classList.contains("button")) {
    let poiId = e.target.closest(".poi-item").getAttribute("data-poi-id");
    makeADetour(getPoiById(poiId));
  }
}

function searchByCategory(e) {
  if (e.target.hasAttribute("data-category")) {
    searchCategory.querySelectorAll("a").forEach(element => element.classList.remove("is-active"));
    e.target.classList.add("is-active");
    filterPOIs();
  }
}

function initSearch() {
  searchInput.value = "";
  document.querySelectorAll("#poi-categories a[data-category]").forEach(el => {
    el.classList.remove("is-active");
    if (el.dataset.category === "all") el.classList.add("is-active");
  });
  filterPOIs(pois);
}

function filterPOIs() {
  const textQuery = searchInput.value;
  // const categoryQuery = searchCategory.querySelector(".is-active").getAttribute("data-category");
  // const filteredPOIs = pois.filter(element => {
  //   if (categoryQuery === "all") return element.title.match(new RegExp(textQuery, "i"));
  //   return element.category === categoryQuery && element.title.match(new RegExp(textQuery, "i"));
  // });
  const filteredPOIs = pois.filter(element => {
    return element.title.match(new RegExp(textQuery, "i"));
  });
  renderList(filteredPOIs);
}

/*
 * day, h, m (and s)
 */
function humanizeSecondsDuration(seconds) {
  let humanText = "";

  var days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  var hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  var minutes = Math.floor(seconds / 60);

  // Unused - Remaining seconds
  seconds -= minutes * 60;

  humanText += (days > 0) ? days + " day, " : ""
  humanText += (hours > 0) ? hours + "h and " : ""
  humanText += minutes + "min"

  return humanText;
}

function getPoiById(id) {
  for (let i = 0; i < pois.length; i++) {
    if (pois[i]._id === id) {
      return pois[i];
    }
  }
}

export default function initWithUrlParms() {
  let url = new URL(window.location.href);
  let origin = url.searchParams.get("origin");
  let destination = url.searchParams.get("destination");

  if (origin == null || destination == null) {
    return;
  }

  inputFrom.value = origin;
  inputTo.value = destination;

  getItineraryBtn.click();
}
