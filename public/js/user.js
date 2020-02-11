import APIHandler from "./APIHandler.js";
const detour = new APIHandler("http://localhost:8000");

// Delete POI for a user
const deletePOIBtns = document.querySelectorAll(".delete-poi-btn");
if (deletePOIBtns)
  deletePOIBtns.forEach(btn => {
    console.log(btn.getAttribute("data-user"), "----------", btn.getAttribute("data-poi"));

    btn.onclick = () => deleteUserPOI(userID, poiID);
  });

function deleteUserPOI(userID, poiID) {}
