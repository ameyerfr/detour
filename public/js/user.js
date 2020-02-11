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
  deleteBtn.addEventListener("focusout", () => cancelDelete(deleteBtn));
  deleteBtn.addEventListener("click", () => deleteBtn.classList.add("confirm"));
  if (deleteBtn.classList.contains("confirm")) confirmDelete(deleteBtn);
  function cancelDelete(el) {
    el.textContent = "Delete";
    el.classList.remove("confirm");
  }
  async function confirmDelete(el) {
    try {
      await detour.deleteUserPOI(userID, poiID);
      document.querySelector(`[data-poi="${poiID}"]`).remove();
    } catch (error) {
      console.log("Unable to delete POI");
    }
  }
}
