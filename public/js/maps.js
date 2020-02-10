/**
 * This function is called as a callback by the google maps script
 */
function initMap() {

  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 48.8558466, lng: 2.2915904} // Paris
  });

  // New detour helper
  const routeHelper = new DetourRoutes(map);

  var onChangeHandler = function() {

    let directionRequest = {
      origin: {query: document.getElementById('start').value},
      destination: {query: document.getElementById('end').value}
    };

    routeHelper.generateRoute(directionRequest)

  };

  document.getElementById('end').addEventListener('change', onChangeHandler);

}
