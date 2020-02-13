import APIHandler from "./apiHandler.js";
const addressMap = new APIHandler();

//IMAGE UPDATE on add & edit poi 

var imgElement = document.getElementById("image-display")
var inputImage = document.getElementById("image")

inputImage.onchange = (evt) => {

  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var dataURL = reader.result;
    console.log(dataURL)
    imgElement.setAttribute("src",dataURL)
  };
  reader.readAsDataURL(input.files[0])

  var elemsToDisplay = document.getElementById("elems-to-display")
  elemsToDisplay.classList.remove("is-hidden")

}

//CASE IMAGE="" ON EDIT LOAD
var title = document.querySelector("h1").innerText
if (!title.includes("Add") && inputImage.getAttribute("src")=="") {
  var elemsToDisplay = document.getElementById("elems-to-display")
  elemsToDisplay.classList.add("is-hidden")
}



/////////////////////
//ADDRESS & MAP STUFF
/////////////////////

const inputAddress = document.getElementById("address")

///INITMAP
function initMap() {

    var title = document.querySelector("h1").innerText

    if (!title.includes("Add") && inputAddress !== "") {

        addressMap.getCoords(inputAddress.value)
        .then(res => {
            var marker = new google.maps.Marker({ position: res.data, title: "A"})
            var map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: res.data
                });
            marker.setMap(map);
        })
        .catch(err => console.log(err))
    }

    var options = {
        //bounds: defaultBounds,
        zoom: 6,
        center:  {lat: 48, lng: 2}
        };

    new google.maps.Map(document.getElementById('map'), options);
}

initMap()

//AUTOCOMPLETE ADDRESS
const autocomplete=new google.maps.places.Autocomplete(inputAddress, {componentRestrictions: {country: 'fr'}})

autocomplete.addListener('place_changed', function() {
  var place = autocomplete.getPlace();
  var position = {lat:place.geometry.location.lat(), lng:place.geometry.location.lng()}
  var marker = new google.maps.Marker({ position: position, title: "A"})
  var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: position
    });
  marker.setMap(map);
});


//ADD MARKER ON MAP
// inputAddress.onchange = () => {

//   addressMap.getCoords(inputAddress.value)
//   .then(res => {
//       var marker = new google.maps.Marker({ position: res.data, title: "A"})
//       var map = new google.maps.Map(document.getElementById("map"), {
//           zoom: 10,
//           center: res.data
//         });
//       marker.setMap(map);
//   })
//   .catch(err => console.log(err))

// }