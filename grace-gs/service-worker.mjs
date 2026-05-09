"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 */

/**
 * Grace Governance Solutions Ltd: Service Worker
 * Cache-first for static assets, network-first for dynamic content
 * 
 * @version 1.0.0
 * @license MIT
 */

const CACHE_VERSION = 2;
const CACHE_NAME = `grace-gs-v${CACHE_VERSION}`;

// Assets to pre-cache during install
const SHELL_ASSETS = [
    "/",
    "/offline",                             // pre-cache offline route
    "/assets/app.webmanifest",
    "/assets/appxmanifest.xml",
    "/assets/favicon.ico",

    // JS modules
    "/assets/js/application.mjs",
    "/assets/js/mods/helpers.mjs",
    "/assets/js/mods/jsonld.mjs",
    "/assets/js/mods/navigation.mjs",
    "/assets/js/mods/pagination.mjs",
    "/assets/js/mods/pwa.mjs",
    "/assets/js/enhancements/share.mjs",
    "/assets/js/enhancements/push.mjs",
    "/assets/js/enhancements/email.mjs",
    "/assets/js/enhancements/offline-banner.mjs",
    "/assets/js/enhancements/background-sync.mjs",
    "/assets/js/enhancements/view-transitions.mjs",

    // Ghost
    "https://cdn.jsdelivr.net/ghost/portal@~2.37/umd/portal.min.js",
    "https://cdn.jsdelivr.net/ghost/sodo-search@~1.1/umd/sodo-search.min.js",

    // JSON-LD module
    "/assets/json/site.jsonld",

    // CSS — base
    "/assets/css/base/reset.css",
    "/assets/css/base/tokens.css",
    "/assets/css/base/elements.css",
    "/assets/css/base/utilities.css",

    // CSS — components
    "/assets/css/components/buttons.css",
    "/assets/css/components/nav.css",
    "/assets/css/components/hero.css",
    "/assets/css/components/section.css",
    "/assets/css/components/about.css",
    "/assets/css/components/author.css",
    "/assets/css/components/products.css",
    "/assets/css/components/offline.css",
    "/assets/css/components/pagination.css",
    "/assets/css/components/features.css",
    "/assets/css/components/clients.css",
    "/assets/css/components/faq.css",
    "/assets/css/components/newsletter.css",
    "/assets/css/components/post-card.css",
    "/assets/css/components/cta.css",
    "/assets/css/components/footer.css",
    "/assets/css/components/cookie-notice.css",
    "/assets/css/components/dialog.css",

    // CSS — overrides + ghost
    "/assets/css/overrides/responsive.css",
    "/assets/css/overrides/motion.css",
    "/assets/css/overrides/print.css",
    "/assets/css/ghost/required.css",
];

// Assets to cache on first request (runtime caching)
const RUNTIME_CACHE_PATTERNS = [
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/,
];

const DB_NAME = "grace-gs-queue";
const STORE = "outbox";

function openDB() {
    return new Promise((res, rej) => {
        const r = indexedDB.open(DB_NAME, 1);
        r.onupgradeneeded = () => r.result.createObjectStore(STORE, { autoIncrement: true });
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
    });
}

self.addEventListener("message", async (event) => {
    if (event.data === "skipWaiting") return self.skipWaiting();
    if (event.data === "clearCache") return caches.delete(CACHE_NAME);

    if (event.data?.type === "queue-contact") {
        const db = await openDB();
        const tx = db.transaction(STORE, "readwrite");
        event.waitUntil(tx.objectStore(STORE).add({ url: event.data.url, payload: event.data.payload, at: Date.now() }));
    }
});

self.addEventListener("sync", (event) => {
    if (event.tag !== "contact-submit") return;
    event.waitUntil(drainOutbox());
});

async function drainOutbox() {
    const db = await openDB();
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const all = await new Promise((res, rej) => {
        const r = store.getAll();
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
    });
    for (const item of all) {
        try {
            const res = await fetch(item.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item.payload)
            });
            if (res.ok) store.delete(item.id);
        } catch { /* leave it queued */ }
    }
}

// ── Install: Pre-cache shell assets ───────────────────────────────────────────
self.addEventListener("install", (event) => {
    console.log("[SW] Installing service worker v" + CACHE_VERSION);
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            const results = await Promise.allSettled(
                SHELL_ASSETS.map(async (url) => {
                    const res = await fetch(url, { cache: "reload" });
                    if (!res.ok) throw new Error(`${url} → ${res.status}`);
                    return cache.put(url, res);
                })
            );
            const failed = results
                .map((r, i) => (r.status === "rejected" ? `${SHELL_ASSETS[i]}: ${r.reason}` : null))
                .filter(Boolean);
            if (failed.length) {
                console.warn("[SW] Some shell assets failed to pre-cache:", failed);
            } else {
                console.log("[SW] Shell assets cached successfully");
            }
        })
    );

    // Activate immediately without waiting for existing pages to close
    self.skipWaiting();
});

// ── Activate: Clean up old caches ─────────────────────────────────────────────
self.addEventListener("activate", event => {
    console.log("[SW] Activating service worker v" + CACHE_VERSION);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.filter(name => name !== CACHE_NAME).map(name => {
                console.log("[SW] Deleting old cache:", name);
                return caches.delete(name);
            }));
        }).then(() => {
            console.log("[SW] Old caches cleaned up");
        })
    );

    // Take control of all pages immediately
    self.clients.claim();
});

// ── Fetch: Serve from cache or network ────────────────────────────────────────
self.addEventListener("fetch", event => {

    const request = event.request;
    const url = new URL(request.url);

    // Only handle GET requests
    if (request.method !== "GET") {
        return;
    }

    // Skip cross-origin requests except for fonts
    if (url.origin !== self.location.origin &&
        !url.hostname.includes("googleapis.com") &&
        !url.hostname.includes("gstatic.com")) {
        return;
    }

    // Strategy 1: Network-first for HTML (navigations)
    // Always try to get fresh HTML, fallback to cache
    if (request.mode === "navigate" || request.destination === "document") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    return response;
                })
                .catch(async () => {
                    // Network failed — try cached version of this URL,
                    // then fall back to the offline page, then home.
                    const cached = await caches.match(request);
                    if (cached) return cached;

                    const offline = await caches.match("/offline/");
                    if (offline) return offline;

                    const home = await caches.match("/");
                    if (home) return home;

                    // Last resort: a minimal inline response
                    return new Response(
                        "<!doctype html><meta charset=utf-8><title>Offline</title><h1>You're offline</h1>",
                        { headers: { "Content-Type": "text/html" } }
                    );
                })
        );
        return;
    }

    // Strategy 2: Cache-first for static assets
    // CSS, JS, images - serve from cache, update in background
    if (isStaticAsset(url.pathname)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                // Return cached version immediately
                const fetchPromise = fetch(request)
                    .then((response) => {
                        // Update cache in background
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(() => cached);

                return cached || fetchPromise;
            })
        );
        return;
    }

    // Strategy 3: Stale-while-revalidate for fonts
    if (isFont(url)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const fetchPromise = fetch(request).then((response) => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                });

                return cached || fetchPromise;
            })
        );
        return;
    }

    // Default: Network with cache fallback
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok && url.origin === self.location.origin) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(request))
    );

});

// ── Helper Functions ──────────────────────────────────────────────────────────

/**
 * Check if the request is for a static asset
 */
function isStaticAsset(pathname) {
    return /\.(?:css|js|mjs|png|jpg|jpeg|svg|gif|webp|ico|woff|woff2)$/.test(pathname);
}

/**
 * Check if the request is for a font
 */
function isFont(url) {
    return (
        url.hostname.includes("googleapis.com") ||
        url.hostname.includes("gstatic.com") ||
        /\.(?:woff|woff2|ttf|otf|eot)$/.test(url.pathname)
    );
}

// ── Message Handler ───────────────────────────────────────────────────────────
self.addEventListener("message", (event) => {
    if (event.data === "skipWaiting") {
        self.skipWaiting();
    }

    if (event.data === "clearCache") {
        caches.delete(CACHE_NAME).then(() => {
            console.log("[SW] Cache cleared");
        });
    }
});