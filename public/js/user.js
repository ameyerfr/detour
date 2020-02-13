import APIHandler from "./apiHandler.js";
const detour = new APIHandler();

// Delete POI for a user
const deletePOIBtns = document.querySelectorAll(".delete-poi-btn");
if (deletePOIBtns)
  deletePOIBtns.forEach(btn => {
    btn.onclick = evt => deleteUserPOI(btn.getAttribute("data-user"), btn.getAttribute("data-poi"), evt);
  });

function deleteUserPOI(userID, poiID, evt) {
  const deleteBtn = evt.target;
  deleteBtn.textContent = "Are you sure?";
  deleteBtn.classList.add("confirm");
  deleteBtn.addEventListener("blur", cancelDelete);
  deleteBtn.addEventListener("click", confirmDelete);
  function cancelDelete() {
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.remove("confirm");
    deleteBtn.removeEventListener("blur", cancelDelete);
    deleteBtn.removeEventListener("click", confirmDelete);
  }
  async function confirmDelete() {
    try {
      if (deleteBtn.classList.contains("confirm")) {
        await detour.deleteUserPOI(userID, poiID);
        document.querySelector(`[data-poi="${poiID}"]`).remove();
      }
    } catch (error) {
      console.log("Unable to delete POI");
    }
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
