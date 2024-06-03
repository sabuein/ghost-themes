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
    scrollBackToTop
} from "view";

switch (document.readyState) {
    case "loading":
        // The document is loading.
        break;
    case "interactive": {
        // The document has finished loading and we can access DOM elements.
        // Sub-resources such as scripts, images, stylesheets and frames are still loading.
        const consent = window.localStorage.getItem("cookie-consent");
        if (!!consent && JSON.parse(consent).accepted === true) id("cookies").remove();

        offlineDetection();
        break;
    }
    case "complete":
        // The page is fully loaded.
        console.log(`The first CSS rule is: ${document.styleSheets[0].cssRules[0].cssText}`,);
        
        break;
}

const closeCookies = id("close-cookies"),
    agreedCookies = id("cookies-agreed"),
    hideCookies = id("hide-cookies"),
    moreCookiesInfo = id("more-cookies-info"),
    moreCookies = id("more-cookies"),
    backToTop = qs(`a[href="#site-header"]:any-link`),
    clients = $("*.inner-clients");

// Adding event listeners

if (!!closeCookies) {
    closeCookies.addEventListener("click", closeCookiesButton);
    if (!!hideCookies) hideCookies.addEventListener("click", () => closeCookies.click());
}

if (!!agreedCookies) {
    agreedCookies.addEventListener("click", () => {
        window.localStorage.setItem("cookie-consent", JSON.stringify({ accepted: true }));
        closeCookies.click();
    });
}

if (!!moreCookiesInfo) {
    moreCookiesInfo.addEventListener("click", () => window.location.assign("/cookie-policy/"));
    if(!!moreCookies) moreCookies.addEventListener("click", () => moreCookiesInfo.click());
}

if (!!backToTop) {
    window.onscroll = () => toggleBackToTopButton(backToTop);
    backToTop.addEventListener("click", scrollBackToTop);
}

// Enable client left auto-scrolling
if (!!clients.length) horizontalScrolling(clients.first(), 850, 3000);