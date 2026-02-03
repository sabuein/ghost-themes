"use strict";

import initPWA, { initInstallApp } from "./mods/pwa.mjs";
import initTheme from "./mods/theme.mjs";
import initNotifier from "./mods/notifier.mjs";
import initRouter from "./mods/router.mjs";
import { initializeBackToTop, initializeInfiniteScroll, initializeAnimateOnScroll, CookieManager } from "./mods/ui.mjs";
import { createBeacon } from "./mods/beaconClient.mjs";

const beacon = createBeacon({
    endpoint: "http://localhost:3001/log",
    getContext: () => ({ app: "myPWA", version: "1.0.0" }),
});

window.addEventListener("load", async () => {
    try {
        // Some risky code
        await initPWA();

        // Custom events
        beacon.event("hello", { who: "world" });
    } catch (err) {
        beacon.error(err, { where: "bootstrap" });
    }
});

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {

    const results = await Promise.allSettled([
        initRouter(),
        await initTheme(),
        await initNotifier(),
        await initInstallApp(),
        await initializeBackToTop(),
        await initializeInfiniteScroll(),
        await initializeAnimateOnScroll(),
    ]);

    results.forEach(result => {
        if (result.status === "fulfilled") {
            console.log("Success:", result.value);
        } else {
            console.error("Error:", result.reason);
        }
    });

    // Custom events
    beacon.event("route_change", { path: location.pathname });

    // Guard when you have unsaved form edits
    beacon.enableBeforeUnloadGuard(() => "You have unsaved edits.");
    // beacon.disableBeforeUnloadGuard();

    // DOM Elements
    const menuToggle = document.querySelector(".menu-toggle");
    const menuIcon = document.querySelector(".menu-icon");
    const closeIcon = document.querySelector(".close-icon");
    const mobileNav = document.querySelector(".mobile-nav");

    new CookieManager();

    // Toggle mobile menu
    menuToggle.addEventListener("click", function () {
        mobileNav.classList.toggle("active");
        menuIcon.classList.toggle("hidden");
        closeIcon.classList.toggle("hidden");
    });

    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll(".mobile-nav a");
    mobileLinks.forEach((link) => {
        link.addEventListener("click", function () {
            mobileNav.classList.remove("active");
            menuIcon.classList.remove("hidden");
            closeIcon.classList.add("hidden");
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
        const isClickInsideMenu = mobileNav.contains(event.target);
        const isClickOnMenuToggle = menuToggle.contains(event.target);

        if (
            !isClickInsideMenu &&
            !isClickOnMenuToggle &&
            mobileNav.classList.contains("active")
        ) {
            mobileNav.classList.remove("active");
            menuIcon.classList.remove("hidden");
            closeIcon.classList.add("hidden");
        }
    });
});
