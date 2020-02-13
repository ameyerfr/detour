import DetourRoutes from "./detourRoutes.js";
import initWithUrlParms from "./detour.js";

function initApp() {
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 48.8558466, lng: 2.2915904 } // Paris
  });

  window.DETOUR = {};

  // New detour helper
  window.DETOUR.routeHelper = new DetourRoutes(map);

  initWithUrlParms();
}

initApp();
