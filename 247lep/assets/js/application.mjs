"use strict";

import {
    id,
    qs,
    offlineDetection,
    setCountries,
    addAppInstallButton,
    registerServiceWorker,
    sharingLinks,
    sharingFiles,
    clearSiteData,
    vw
} from "helpers";

import {
    closeCookiesButton,
    horizontalScrolling,
    toggleBackToTop,
    scrollBackToTop,
    setupDialogs,
    showSubMenu,
    showMobileMenu,
    hideMobileMenu
} from "view";

document.onreadystatechange = (event) => {
    switch (document.readyState) {
        case "loading":
            // The document is loading.
            break;
        case "interactive": {
            // The document has finished loading and we can access DOM elements.
            // Sub-resources such as scripts, images, stylesheets and frames are still loading.
            
            
            break;
        }

        case "complete":
            // The page is fully loaded.
            // console.log(`The first CSS rule is: ${document.styleSheets[0].cssRules[0].cssText}`,);

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

                    id("cookies").style.display = "flex";
                }
            }

            showSubMenu("*.app-navigation *.primary-nav *.nav-services button", "*.app-navigation *.primary-nav *.services-nav");
            id(`appShowMenu`).addEventListener("click", showMobileMenu, false);
            id(`appHideMenu`).addEventListener("click", hideMobileMenu, false);

            document.onkeydown = function(ev) {
                const event = ev || window.event;
                let isEscape = false;
                if ("key" in event) isEscape = (event.key === "Escape" || event.key === "Esc");
                else isEscape = (event.keyCode === 27);

                if (isEscape) {
                    if (vw() <= 1080) {
                        document.dispatchEvent(new Event("click"));
                        id("appHideMenu").click();
                    } else {
                        qs("*.services-nav").classList.remove("visible");
                        id("servicesMenuButton").blur();
                    }
                }
            };

            window.onresize = (event) => {
                if (vw() > 1080) qs("*.primary-nav").style.display = "flex";
                else qs("*.primary-nav").style.display = "none";
            };

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
            window.onscroll = () => toggleBackToTop(qs(`:has(> a[href="#site-header"])`));

            // Enable client left auto-scrolling
            const clients = $("*.inner-clients");
            if (!!clients.length) horizontalScrolling(clients.first(), 850, 3000);

            addAppInstallButton();
            registerServiceWorker();
            offlineDetection();
            setupDialogs();
            
            break;
    }
};