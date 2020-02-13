/**
 * This function is called as a callback by the google maps script
 */
function initMap() {
  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 48.8558466, lng: 2.2915904 } // Paris
  });

  initDetour(map);
}

function initDetour(map) {
  window.DETOUR = { map: map };

  // New detour helper
  window.DETOUR.routeHelper = new DetourRoutes(map);
}

// Misc functions required on all pages
document.addEventListener("DOMContentLoaded", () => {
  // Toggle main menu on mobile
  const menu = document.querySelector(".navbar-burger");
  menu.addEventListener("click", () => {
    const target = menu.dataset.target;
    const $target = document.getElementById(target);
    menu.classList.toggle("is-active");
    $target.classList.toggle("is-active");
  });

  // Remove notification messages
  (document.querySelectorAll(".notification") || []).forEach($notification => {
    $notification.addEventListener("click", () => {
      $notification.remove();
    });
  });
});
