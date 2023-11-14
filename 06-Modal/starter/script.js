'use strict';

const btns = document.querySelectorAll(".show-modal");
const closeBtn = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");

const showHideModal = (e) => {
    const clickedBtn = e.target;
    if (e.key === "Escape" || clickedBtn.classList.contains("close-modal") || clickedBtn.classList.contains("overlay")) {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    } else if (clickedBtn.classList.contains("show-modal")) {
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    }
}
btns.forEach((btn) => btn.addEventListener("click", (e) => showHideModal(e)));
closeBtn.addEventListener("click", (e) => showHideModal(e));
overlay.addEventListener("click", (e) => showHideModal(e));
window.addEventListener("keydown", (e) => showHideModal(e));