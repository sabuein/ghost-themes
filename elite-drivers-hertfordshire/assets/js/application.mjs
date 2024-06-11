"use strict";

import {
    id,
    qs,
    offlineDetection,
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

        offlineDetection();
        setupDialogs();

        const consent = window.localStorage.getItem("cookie-consent");
        if (!!consent && JSON.parse(consent).accepted === true) id("cookies").remove();
        else {
            const closeCookies = id("close-cookies"),
                acceptCookies = id("accept-cookies"),
                declineCookies = id("decline-cookies");

            closeCookies?.addEventListener("click", closeCookiesButton);
            declineCookies?.addEventListener("click", () => closeCookies.click());

            acceptCookies?.addEventListener("click", () => {
                window.localStorage.setItem("cookie-consent", JSON.stringify({ accepted: true }));
                closeCookies?.click();
            });
        }

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