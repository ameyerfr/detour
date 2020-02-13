class DetourRoutes {

  constructor(map) {
    this.map = map
    this.service = new google.maps.DirectionsService();
    this.renderer = new google.maps.DirectionsRenderer();
    this.renderer.setMap(map);
    this.travelMode = 'DRIVING';
    this.spacing = 10000;
    this.searchRadius = 20000;
    this.markers = []
  }

  addStopOver(poi) {

    let coordinates = poi.coordinates;

    this.directionRequest.waypoints = [{
      location : {lat:coordinates.lat, lng:coordinates.lng},
      stopover : false
    }]

    return new Promise((resolve, reject) => {
    this.service.route(this.directionRequest, async (response, status) => {

        console.log("addStopOver response : ", response)

        if (status !== 'OK') {
          reject({error : "GMAP API CALL TO DIRECTION FAILED : " + status})
        }

        // Store current route
        this.detourRoute = response.routes[0];

        // Draw itinerary on map
        this.renderItinerary(response);

        // Give time for the render itinerary
        setTimeout(() => {

          // Zoom map
          this.map.setZoom(12);

          // Move to POI
          this.map.panTo({lat:coordinates.lat, lng:coordinates.lng});

        }, 200)

        resolve({ duration : {
          originalDuration : this.getCurrentRouteDuration(),
          detourDuration   : this.getAlternativeRouteDuration(),
          diff             : this.getAlternativeRouteDurationDiff()
        }})

    });
    });

  }
  /**
   * This method does in order :
   *  - API Call to google MAPS
   *  - Renders the result of MAPS API on the map
   *  - Calculate a spacing for the coordinates where we will make a POI search
   *  - Make a call to Detour api
   *  - Orders the resulting pois
   *  - Display a Maker on the map for each poi
   */
  generateRoute(directionRequest, categories) {

    directionRequest.travelMode = this.travelMode;
    this.directionRequest = directionRequest;

    // Reset
    this.clearAllMarkers();

    return new Promise((resolve, reject) => {

      this.service.route(directionRequest, async (response, status) => {

          if (status !== 'OK') {
            reject({error : "GMAP API CALL TO DIRECTION FAILED : " + status})
          }

          // Draw itinerary on map
          this.renderItinerary(response);

          // Store current route
          this.currentRoute = response.routes[0];

          // Calculate a list of coordinates from where we will request POIs
          let spacedCoords = this.getSpacedCoordsFromRoute(this.spacing)

          // Get the POIs close to the the spacedCoords
          let detourPois = await this.getPoisFromDB(spacedCoords, categories)

          // Order the POIs from the Origin of the route
          this.orderPoisFromOrigin(detourPois)

          // For each POI, display a custom Marker on the map
          detourPois.forEach((poi, i) => {
            this.addMarker(poi._id, {lat:poi.location.coordinates[1], lng :poi.location.coordinates[0]}, (i + 1).toString())
          })

          resolve({
            duration : this.getCurrentRouteDuration(),
            pois : detourPois
          });

      });

    });

  }

  /* Draws directionResults on map */
  renderItinerary(directionResults) {
    this.renderer.setDirections(directionResults);
  }

  /**
   * This method uses the overview_path of the currentRoute
   * and return a list of coorinates spaced by about the spacing parameter
   */
  getSpacedCoordsFromRoute(spacing) {
    const overViewPath = this.currentRoute.overview_path;

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

  /**
   * This method makes a call to Detour's API
   * And return the resulting Pois
   */
  async getPoisFromDB(spacedCoords, categories) {
    // Detour API Call
    const results = await axios.post("/api/poi/list", {
      coordinates : spacedCoords,
      radius : this.searchRadius,
      categories : categories
    })
    return results.data.pois;
  }

  /* Add a marker on the map */
  addMarker(id, coord, label) {
    let m = new google.maps.Marker({ position: coord, label : label})
    m.set("id", id) // Embed the id of the poin into the marker
    this.markers.push(m)
    m.setMap(this.map);
  }

  clearAllMarkers() {
    this.markers.forEach(m => {
      m.setMap(null)
    })
    this.markers = [];
  }

  getMarkerByPoiId(id) {
    for (let i = 0; i < this.markers.length; i++) {
      if(this.markers[i].get("id") === id) {
        return this.markers[i];
      }
    }
  }

  /**
   * This method sorts the POIs
   * From the Origin point of the current route
   */
  orderPoisFromOrigin(pois) {
    const originCoords = this.getStartLocationCoordinates();

    pois.sort((a, b ) => {
      return this.geoSpatialDist(originCoords.lat, originCoords.lng, a.coordinates.lat, a.coordinates.lng) - this.geoSpatialDist(originCoords.lat, originCoords.lng, b.coordinates.lat, b.coordinates.lng);
    })

    return pois;
  }

  /* Get the coordinates of the origin of the current route */
  getStartLocationCoordinates() {
    if (!this.currentRoute) { return null }

    return {
      lat : this.currentRoute.legs[0].start_location.lat(),
      lng : this.currentRoute.legs[0].start_location.lng()
    }
  }

  getCurrentRouteDuration() {
    return this.currentRoute.legs[0].duration.value;
  }

  getAlternativeRouteDuration() {
    return this.detourRoute.legs[0].duration.value;
  }

  getAlternativeRouteDurationDiff() {
    return this.getAlternativeRouteDuration() - this.getCurrentRouteDuration();
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

export default DetourRoutes;
