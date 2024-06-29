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
    setupDialogs
} from "view";

switch (document.readyState) {
    case "loading":
        // The document is loading.
        break;
    case "interactive": {
        // The document has finished loading and we can access DOM elements.
        // Sub-resources such as scripts, images, stylesheets and frames are still loading.

        registerServiceWorker();

        offlineDetection();
        setupDialogs();

        const consent = window.localStorage.getItem("isCookiesVisible");
        if (!!id("cookies")) {
            if (!!consent && consent === "false") id("cookies").remove();
            else {
                const closeCookies = id("close-cookies"),
                    acceptCookies = id("accept-cookies"),
                    declineCookies = id("decline-cookies");

                closeCookies?.addEventListener("click", closeCookiesButton);
                declineCookies?.addEventListener("click", () => closeCookies.click());

                acceptCookies?.addEventListener("click", () => {
                    window.localStorage.setItem("isCookiesVisible", false);
                    closeCookies?.click();
                });
                $(closeCookies).parent().fadeIn(150).css("display", "flex");
            }
        }

        const menuButton = qs(`button[data-html-symbol="trigram-for-heaven"]`);
        if(!!menuButton) {
            // Toggle the menu
            const menu = qs(`ul.primary-nav`);
            if (!!menu) menuButton.addEventListener("click", () => menu.classList.toggle("menu-visible"));
            // Activate close button
            menu.querySelector(`li:first-child button`).addEventListener("click", () => menuButton.click());
        }

        const clearButton = id("clearSiteDataButton");
        if (!!clearButton) clearButton.addEventListener("click", clearSiteData);

        const backToTop = qs(`a[href="#site-header"]`);
        backToTop.addEventListener("click", scrollBackToTop);
        window.onscroll = () => toggleBackToTopButton(backToTop);

        // Enable client left auto-scrolling
        const clients = $("*.inner-clients");
        if (!!clients.length) horizontalScrolling(clients.first(), 850, 3000);
        break;
    }

    case "complete":
        // The page is fully loaded.
        console.log(`The first CSS rule is: ${document.styleSheets[0].cssRules[0].cssText}`,);
        break;
}