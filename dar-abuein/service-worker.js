"use strict";

const VERSION = "v1.0";
const CACHE_NAME = `abuein-${VERSION}`;

// Import map: Defines essential JS files to cache
const importmap = {
    imports: {
        links: "/assets/js/context/links.mjs",
        interface: "/assets/js/mods/interface.mjs",
        media: "/assets/js/mods/media.mjs",
        service: "/assets/js/mods/service.mjs",
        utils: "/assets/js/mods/utils.mjs",
        web: "/assets/js/mods/web.mjs",
        app: "/assets/js/app.js",
        infiniteScroll: "/assets/js/extra/infiniteScroll.js",
        menuOpen: "/assets/js/extra/menuOpen.js",
    },
};

/** Resources to pre-cache (fix: extract only values, not key-value pairs). */
const INITIAL_CACHED_RESOURCES = Object.values(importmap.imports);

self.addEventListener("install", (event) => {
    console.log("[ServiceWorker] Installing...");

    self.skipWaiting(); // Activate worker immediately

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[ServiceWorker] Caching resources:", INITIAL_CACHED_RESOURCES);
            return cache.addAll(INITIAL_CACHED_RESOURCES);
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("[ServiceWorker] Activating...");
    
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("[ServiceWorker] Deleting old cache:", key);
                        return caches.delete(key);
                    }
                })
            )
        ).then(() => self.clients.claim()) // Take control of all pages immediately
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

// Define paths to ignore (e.g., "/api/", "/admin/")
const ignoredPaths = ["/api/", "/admin/"];

// Check if the request path starts with any ignored path
if (ignoredPaths.some((path) => url.pathname.startsWith(path))) {
    return; // Don't handle the request, browser will proceed normally
}

    // Skip non-HTTP(S) requests (e.g., chrome-extension://, file://)
    if (!url.protocol.startsWith("http")) return;

    // Ignore requests for the /ghost/ path (modify as needed)
    if (url.pathname.startsWith("/ghost/")) {
        // Just fetch it without caching
        event.respondWith(fetch(event.request));
        return; // Let the browser handle it normally
    }

    // Network-first strategy for external resources (e.g., API calls)
    if (url.origin !== location.origin && event.request.method === "GET") {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => caches.match(event.request)) // Fallback to cache if offline
        );
        return;
    }

    // Cache-first strategy for internal resources (HTML, CSS, JS)
    if (event.request.method === "GET") {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    return fetch(event.request).then((fetchResponse) => {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    });
                }
            })
        );
        return;
    }

    // Default fallback response for failed requests
    event.respondWith(
        new Response("Network error occurred.", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        })
    );
});

// Listen for messages from the client
self.addEventListener("message", (event) => {
    console.log(`[ServiceWorker] Message received: ${event.data}`);
    event.source.postMessage("Hi client.");
});

// Background sync: Retry sending messages when back online
self.addEventListener("sync", (event) => {
    if (event.tag === "sync-messages") {
        event.waitUntil(sendOutboxMessages());
    }
});

// Periodic sync: Refresh content when network is available
self.addEventListener("periodicsync", (event) => {
    if (event.tag === "content-sync") {
        event.waitUntil(syncContent());
    }
});

// Push notifications handling
self.addEventListener("push", (event) => {
    const message = event.data.json();

    console.log("[ServiceWorker] Push received:", message);

    let notificationTitle = "AbuEin Web Portal";
    let notificationOptions = {
        body: event.data ? event.data.text() : "No message payload.",
        icon: "/assets/icons/icon-192.png",
        badge: "/assets/icons/icon-72.png",
    };

    if (message.type === "init") doInit();
    if (message.type === "shutdown") doShutdown();

    event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});

// Feature detection for background fetch
if (!("BackgroundFetchManager" in self)) {
    console.warn("[ServiceWorker] Background Fetch not supported, using fallback.");
}
