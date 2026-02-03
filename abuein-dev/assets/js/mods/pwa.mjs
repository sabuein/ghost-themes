"use strict";

import { showNotification } from "./notifier.mjs";

let deferredPrompt;
let elements = {};

const unregisterServiceWorkers = async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) registration.unregister();
};

const registerServiceWorkers = async () => {
    if (!("serviceWorker" in navigator)) {
        console.warn("This browser doesn't support service workers.");
        return null;
    }

    unregisterServiceWorkers();

    try {
        const registration = await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
        console.log(`ServiceWorker registration successful with scope: ${registration.scope}.`);
        return registration;
    } catch (error) {
        console.error("ServiceWorker registration failed:", error);
        return null;
    }
};

const initInstallApp = async () => {
    const installButton = document.getElementById("install-button");
    const installWidget = document.getElementById("install-pwa");

    if (!installWidget) {
        console.warn("Couldn't find the PWA install widget!");
        return null;
    }

    if (!installButton) {
        console.warn("Couldn't find the PWA install button!");
        return null;
    }

    installWidget.style.display = "none";
    installButton.addEventListener("click", activateInstallButton);
    elements.installWidget = installWidget;
    elements.installButton = installButton;
};

const activateInstallButton = async () => {
    if (!deferredPrompt) {
        showNotification("App already installed or not installable at the moment.");
        return null;
    }

    try {
        // Show the install prompt
        await deferredPrompt.prompt();

        const result = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${result.outcome}.`);

        if (result.outcome === "accepted") {
            showNotification("Thank you for installing our app!");
        } else {
            showNotification("You can install the app later if you change your mind.", "info");
        }
    } catch (error) {
        console.error("Install prompt failed:", error);
    }

    // Clear the deferredPrompt and hide UI
    deferredPrompt = null;
    hideInstallWidget();
};

// Show the custom install widget
const showInstallWidget = () => {
    const { installWidget } = elements;
    if (installWidget) {
        installWidget.style.display = "flex";
    }
};

// Hide the custom install widget
const hideInstallWidget = () => {
    const { installWidget } = elements;
    if (installWidget) {
        installWidget.style.display = "none";
        installWidget.remove();
    }
};

const detectNetworkThrottling = () => {
    // Manual reload feature.
    document.querySelector("button").addEventListener("click", () => {
        window.location.reload();
    });

    // Listen to changes in the network state, reload when online.
    // This handles the case when the device is completely offline.
    window.addEventListener("online", () => {
        window.location.reload();
    });

    // Check if the server is responding and reload the page if it is.
    // This handles the case when the device is online, but the server
    // is offline or misbehaving.
    async function checkNetworkAndReload() {
        try {
            const response = await fetch(".");
            // Verify we get a valid response from the server
            if (response.status >= 200 && response.status < 500) {
                window.location.reload();
                return null;
            }
        } catch {
            // Unable to connect to the server, ignore.
        }
        window.setTimeout(checkNetworkAndReload, 2500);
    }

    checkNetworkAndReload();
};

const initializePWA = async () => {

    await registerServiceWorkers();

    window.addEventListener("beforeinstallprompt", (event) => {
        // Stop the mini-infobar from appearing on mobile (block auto-prompt).
        event.preventDefault();

        // Save the event for later
        deferredPrompt = event;

        showInstallWidget();
        console.log("beforeinstallprompt event fired and captured.");
    });

    window.addEventListener("appinstalled", (event) => {
        deferredPrompt = null;
        hideInstallWidget();
        console.log("PWA was installed.");
        showNotification("App successfully installed!");
    });
};

export { initializePWA as default, initInstallApp, detectNetworkThrottling };
