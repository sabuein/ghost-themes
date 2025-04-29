"use strict";

const initializeCookieContainer = () => {
    const cookieBanner = document.querySelector(".cookies");
    const consentForm = cookieBanner.querySelector("form");

    // Check for existing consent
    if (!window.localStorage.getItem("cookieConsent")) {
        cookieBanner.style.display = "flex";
    }

    // Handle form submission (Accept)
    consentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        window.localStorage.setItem("cookieConsent", "accepted");
        cookieBanner.style.display = "none";
        console.log("Cookies accepted");
    });

    // If the Decline button is a reset button
    consentForm.addEventListener('reset', function (e) {
        // We still want to save the preference, so we prevent the actual form reset
        e.preventDefault();
        window.localStorage.setItem("cookieConsent", "declined");
        cookieBanner.style.display = "none";
        // console.log("Cookies declined");
    });
};

export {
    initializeCookieContainer
};