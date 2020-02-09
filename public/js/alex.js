console.log('Hello world')

function calculateOffset() {
  //Position, decimal degrees
  const lat = 48.0112333
  const lon = 0.1971284

  //Earth’s radius, sphere
  R=6378137

  //offsets in meters
  const dn = 0
  const de = 10000

  //Coordinate offsets in radians
  let dLat = dn/R
  let dLon = de/(R*Math.cos(Math.PI*lat/180))

  //OffsetPosition, decimal degrees
  let latO = lat + dLat * 180/Math.PI
  let lonO = lon + dLon * 180/Math.PI

  console.log(latO.toFixed(7), lonO.toFixed(7))
}

function getBoundsFromLatLng(){

  //Position, decimal degrees
  const lat = 48.0112333
  const lng = 0.1971284

     var lat_change = 10/111.2;
     var lon_change = Math.abs(Math.cos(lat*(Math.PI/180)));
     var bounds = {
         lat_min : lat - lat_change,
         lon_min : lng - lon_change,
         lat_max : lat + lat_change,
         lon_max : lng + lon_change
     };

     console.log(bounds)

     return bounds;
}
