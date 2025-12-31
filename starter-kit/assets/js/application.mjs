"use strict";

import {
    id,
    qs,
    offlineDetection,
    setCountries,
    registerServiceWorker,
    sharingLinks,
    sharingFiles,
    clearSiteData
} from "helpers";

import {
    closeCookiesButton,
    horizontalScrolling,
    toggleBackToTopButton,
    scrollBackToTop,
    setupDialogs,
    showSubMenu
} from "view";

switch (document.readyState) {
    case "loading":
        // The document is loading.
        break;
    case "interactive": {
        // The document has finished loading and we can access DOM elements.
        // Sub-resources such as scripts, images, stylesheets and frames are still loading.

        const consent = window.localStorage.getItem("isCookiesVisible");
        if (!!id("cookies")) {
            if (!!consent && consent === "false") id("cookies").remove();
            else {
                const closeCookies = id("close-cookies"),
                    acceptCookies = id("accept-cookies");

                closeCookies?.addEventListener("click", closeCookiesButton);

                acceptCookies?.addEventListener("click", () => {
                    window.localStorage.setItem("isCookiesVisible", false);
                    closeCookies?.click();
                });

                // $(closeCookies).parent().fadeIn(150).css("display", "flex");
            }
        }

        // showSubMenu("*.site-navigation *.primary-nav *.nav-services", "*.site-navigation *.primary-nav *.services-nav");

        const menuButton = qs(`button[data-html-symbol="trigram-for-heaven"]`);
        if (!!menuButton) {
            // Toggle the menu
            const menu = qs(`ul.primary-nav`);
            if (!!menu) menuButton.addEventListener("click", () => menu.classList.toggle("menu-visible"));
            // Activate close button
            menu.querySelector(`li:first-child button`).addEventListener("click", () => menuButton.click());
        }

        const clearButton = id("clearSiteDataButton");
        if (!!clearButton) clearButton.addEventListener("click", clearSiteData);

        const backToTop = qs(`a[href="#app"]`);
        backToTop.addEventListener("click", scrollBackToTop);
        window.onscroll = () => toggleBackToTopButton(backToTop);

        // Initialize light mode
        if (document.documentElement.dataset.theme === "") document.documentElement.dataset.theme = "light";

        /* ---------- THEME TOGGLE ---------- */
        const themeToggles = document.querySelectorAll('[data-action="mode"]');
        themeToggles.forEach(btn => {
            btn.addEventListener("click", () => {
                const theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
                document.documentElement.dataset.theme = theme;
                if (theme === "light") {
                    themeToggles[0].hidden = false;
                    themeToggles[0].disabled = false;
                    themeToggles[1].hidden = true;
                    themeToggles[1].disabled = true;
                } else {
                    themeToggles[1].hidden = false;
                    themeToggles[1].disabled = false;
                    themeToggles[0].hidden = true;
                    themeToggles[0].disabled = true;
                }
            });
        });

        /* ---------- SERVICE WORKER ---------- */
        if ("serviceWorker" in window.navigator) registerServiceWorker();
        offlineDetection();
        setupDialogs();
        break;
    }

    case "complete":
        // The page is fully loaded.
        console.log(`The first CSS rule is: ${document.styleSheets[0].cssRules[0].cssText}`,);
        break;
}