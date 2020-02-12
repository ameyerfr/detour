(document.querySelectorAll(".notification") || []).forEach($notification => {
  $notification.addEventListener("click", () => {
    $notification.remove();
  });
});
