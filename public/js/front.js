document.addEventListener("DOMContentLoaded", () => {
  // Toggle main menu on mobile
  const menu = document.querySelector(".navbar-burger");
  menu.addEventListener("click", () => {
    const target = menu.dataset.target;
    const $target = document.getElementById(target);
    menu.classList.toggle("is-active");
    $target.classList.toggle("is-active");
  });
});
