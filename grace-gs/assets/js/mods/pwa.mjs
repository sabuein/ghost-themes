"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 */

/**
 * PWA bootstrap: register the service worker, expose a tiny
 * event bus for install/update prompts, and dynamically import
 * any enhancements that the current browser supports.
 */

const SW_URL = (location.hostname === "localhost") ? "/service-worker.mjs" : "/service-worker.min.mjs";
const SW_SCOPE = "/";

export async function initPWA() {
    if (!("serviceWorker" in navigator)) return;

    // Don't fight the browser during local dev with hot reloads
    // Swap to 127.0.0.1:2368 in the URL bar and the SW will register.
    // Or temporarily comment out the line below while testing PWA features.
    if (location.hostname === "localhost") {
        console.info("Swap to 127.0.0.1:2368 in the URL bar and the SW will register.");
        return;
    }

    try {
        const reg = await navigator.serviceWorker.register(SW_URL, {
            scope: SW_SCOPE,
            type: "module",     // because we ship .mjs
            updateViaCache: "none"
        });

        // New SW found while the page is open — surface an "update ready" toast
        reg.addEventListener("updatefound", () => {
            const sw = reg.installing;
            if (!sw) return;
            sw.addEventListener("statechange", () => {
                if (sw.state === "installed" && navigator.serviceWorker.controller) {
                    dispatchPWAEvent("update-ready", { worker: sw });
                }
            });
        });

        // Refresh the page when the new SW takes over
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (refreshing) return;
            refreshing = true;
            location.reload();
        });
    } catch (err) {
        console.warn("[PWA] SW registration failed:", err);
    }

    // Capture the install prompt so the UI can offer it on demand
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        window.__deferredInstallPrompt = e;
        dispatchPWAEvent("install-available");
    });

    window.addEventListener("appinstalled", () => {
        window.__deferredInstallPrompt = null;
        dispatchPWAEvent("installed");
    });

    // Lazy-load enhancements only if their APIs exist
    loadEnhancementsForThisBrowser();
}

function dispatchPWAEvent(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(`pwa:${name}`, { detail }));
}

async function loadEnhancementsForThisBrowser() {
    const tasks = [];

    if ("share" in navigator) {
        tasks.push(import("../enhancements/share.mjs").then(m => m.initShare?.()));
    }
    if ("PushManager" in window) {
        tasks.push(import("../enhancements/push.mjs").then(m => m.initPush?.()));
    }
    if ("startViewTransition" in document) {
        tasks.push(import("../enhancements/view-transitions.mjs").then(m => m.initViewTransitions?.()));
    }
    // Always useful — needs no special API
    tasks.push(import("../enhancements/offline-banner.mjs").then(m => m.initOfflineBanner?.()));

    // tasks.push(import("../enhancements/share.mjs").then(m => m.initShare?.()));
    tasks.push(import("../enhancements/email.mjs").then(m => m.initEmail?.()));

    await Promise.allSettled(tasks);
}

/** Trigger the saved beforeinstallprompt on a button click. */
export async function promptInstall() {
    const e = window.__deferredInstallPrompt;
    if (!e) return { outcome: "unavailable" };
    e.prompt();
    const { outcome } = await e.userChoice;
    window.__deferredInstallPrompt = null;
    return { outcome };
}