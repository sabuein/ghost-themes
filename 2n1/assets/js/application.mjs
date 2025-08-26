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

import { Website } from "app";

switch (document.readyState) {
    case "loading":
        // The document is loading.
        break;
    case "interactive": {
        // The document has finished loading and we can access DOM elements.
        // Sub-resources such as scripts, images, stylesheets and frames are still loading.

        registerServiceWorker();

        offlineDetection();

        // Initialize the website when DOM is loaded
        new Website();

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


        // Performance optimization: Lazy load images
        const images = document.querySelectorAll('img[src*="placehold.co"]')

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.classList.add("loaded")
          observer.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img) => img.classList.add("loaded"))
  }

        // Handle page visibility changes
        document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            // Page became visible - could refresh data or restart animations
            console.log("Page is now visible")
        } else {
            // Page became hidden - could pause animations or save state
            console.log("Page is now hidden")
        }
        })

        
        /*
        const backToTop = qs(`a[href="#site-header"]`);
        backToTop.addEventListener("click", scrollBackToTop);
        window.onscroll = () => toggleBackToTopButton(backToTop);
        */

        break;
    }

    case "complete":
        // The page is fully loaded.
        console.log(`The first CSS rule is: ${document.styleSheets[0].cssRules[0].cssText}`,);
        break;
}

// Error handling for uncaught errors
window.addEventListener("error", (event) => {
  console.error("Global error caught:", event.error)
  // In production, you might want to send this to an error tracking service
})

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason)
  // In production, you might want to send this to an error tracking service
})