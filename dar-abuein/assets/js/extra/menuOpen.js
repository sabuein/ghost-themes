"use strict";

// js/pwa.js

// Toggle the menu open and close when on mobile
export default function menuOpen() {
    const burgerButton = document.querySelector('.gh-burger');
    burgerButton.addEventListener("click", () => {
        const open = document.body.classList.toggle("gh-head-open");
        burgerButton.setAttribute("aria-expanded", String(open));
    });
}