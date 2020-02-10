class DetourRoutes {

  constructor(map) {
    this.map = map
    this.service = new google.maps.DirectionsService();
    this.renderer = new google.maps.DirectionsRenderer();
    this.renderer.setMap(map);
    this.travelMode = 'DRIVING';
  }

  generateRoute(directionRequest) {

    directionRequest.travelMode = this.travelMode;

    this.service.route(directionRequest, (response, status) => {

          if (status !== 'OK') {
            console.log("GMAP API CALL TO DIRECTION FAILED : ", status)
          }

          console.log(response, response.routes[0])

          // Draw itinerary on map
          this.renderItinerary(response);

          let spacedCoords = this.getSpacedCoordsFromRoute(response.routes[0], 10000)
          this.getPoisFromDB(spacedCoords)

      });

  }

  renderItinerary(directionResults) {
    this.renderer.setDirections(directionResults);
  }

  getSpacedCoordsFromRoute(directionsRoute, spacing) {
    const overViewPath = directionsRoute.overview_path;

    let accumulator = 0;
    let previousCoords = {lat : overViewPath[0].lat(), lng : overViewPath[0].lng() };
    let endPoints = []

    for (let i = 1; i < overViewPath.length; i++) {
      let coord = overViewPath[i];
      let coordLAT = coord.lat();
      let coordLNG = coord.lng();

      let actualDistance = this.geoSpatialDist(previousCoords.lat, previousCoords.lng, coordLAT, coordLNG);
      accumulator += actualDistance;

      if(accumulator >= spacing) {
        accumulator = 0;
        endPoints.push(previousCoords)
      }

      previousCoords = { lat : coordLAT, lng : coordLNG }

    }

    console.log("NUMBER OF COORDS : ", overViewPath.length)
    console.log("NUMBER OF CHECK POINTS : ", endPoints.length)

    return endPoints;

  }

  getPoisFromDB(spacedCoords) {

    // TODO DB API CALL
    spacedCoords.forEach(coord => {
      this.addMarker(coord)
    })

  }

  addMarker(coord) {
    let m = new google.maps.Marker({ position: coord })
    m.setMap(this.map);
  }


  // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  // Alex tested for accuracy
  geoSpatialDist(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km * 1000 => return meters
  }

}
