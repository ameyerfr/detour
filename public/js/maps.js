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
  document.getElementById('start').addEventListener('change', onChangeHandler);
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
          directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
}
