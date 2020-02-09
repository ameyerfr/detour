const data = [
  {
    title : "Tour hertzienne de Meudon",
    coord : { lat : 48.803595, lng : 2.201986} // 720m N118
  },
  {
    title : "L'onde - Velizy",
    coord : { lat : 48.7826771, lng : 2.1771492 } // ~3km N118
  },
  {
    title : "France miniature",
    coord : { lat : 48.7756162, lng : 1.9602727 } // ~ 18,9km N118
  }
]
function initMap() {

  console.log("Init map")

  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 48.8558466, lng: 2.2915904}
  });

  directionsRenderer.setMap(map);

  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService.route(
      {
        origin: {query: document.getElementById('start').value},
        destination: {query: document.getElementById('end').value},
        travelMode: 'DRIVING'
      },
      function(response, status) {
        if (status === 'OK') {
          console.log(response.routes[0])
          directionsRenderer.setDirections(response);
          let overViewPath = response.routes[0].overview_path;

          let tLat = 48.8542001;
          let tLng = 2.290423;

          overViewPath.forEach(coord => {
            console.log( distance(tLat, tLng, coord.lat(), coord.lng()) )
          })

        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
}

// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
