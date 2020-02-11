import APIHandler from "./APIHandler.js";
const detour = new APIHandler("http://localhost:8000");

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
