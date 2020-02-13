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

  //to execute only for add a poi
  var title = document.querySelector("h1").innerText
  if (title.includes("Add")) {
    var elemsToDisplay = document.getElementById("elems-to-display")
    elemsToDisplay.classList.remove("is-hidden")
  }
}

//AUTOCOMPLETE ADDRESS
var defaultBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(51, -4.2),
  new google.maps.LatLng(42.5, 7.1));

var options = {
  bounds: defaultBounds
}

var inputAddress = document.getElementById("address")
//map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

var autocomplete=new google.maps.places.Autocomplete(inputAddress, options)

// inputAddress.onchange = () => {
//   new google.maps.Marker({ position: coord, label : label})
//   m.setMap(this.map);
// }
