// Service Worker for PWA functionality

const VERSION = "1.0.0",
    STATIC_CACHE = `abuein-static-v${VERSION}`,
    RUNTIME_CACHE = `abuein-runtime-v${VERSION}`,
    IMAGES = [
        "/assets/images/logos/ghost-logo-light.png",
        "/assets/images/logos/ghost-logo-dark.png",
        "/assets/images/AppImages/ios/144.png",
        "/assets/images/favicons/favicon.svg",
    ],
    LOGIC = [
        "/assets/js/mods/careers.mjs",
        "/assets/js/mods/contact.mjs",
        "/assets/js/mods/notifier.mjs",
        "/assets/js/mods/portfolio.mjs",
        "/assets/js/mods/pwa.mjs",
        "/assets/js/mods/theme.mjs",
        "/assets/js/mods/ui.mjs",
        "/assets/js/pages/testing.mjs",
        "/assets/js/application.mjs",
    ],
    STYLES = [
        "/assets/css/components/animation.css",
        "/assets/css/components/buttons.css",
        "/assets/css/components/global.css",
        "/assets/css/components/reset.css",
        "/assets/css/components/variables.css",
        "/assets/css/components/testing.css",
        "/assets/css/widgets/careers.css",
        "/assets/css/widgets/portfolio.css",
        "/assets/css/screen.css",
    ],
    GHOST = [
        "/public/cards.min.css",
        "/public/cards.min.js",
        "/public/comment-counts.min.js",
        "/public/member-attribution.min.js",
        "https://cdn.jsdelivr.net/ghost/portal@~2.50/umd/portal.min.js",
        "https://cdn.jsdelivr.net/ghost/sodo-search@~1.5/umd/sodo-search.min.js",
        "https://cdn.jsdelivr.net/ghost/announcement-bar@~1.1/umd/announcement-bar.min.js",
        "https://cdn.jsdelivr.net/ghost/signup-form@~0.2/umd/signup-form.min.js"
    ],
    OFFLINE_URL = "/offline/";

const urlsToCache = [
    "/",
    "/app.webmanifest",
    "/favicon.ico",
    ...IMAGES,
    ...LOGIC,
    ...STYLES,
    ...GHOST,
    OFFLINE_URL
];

// Install event - cache assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log("Pre-caching static assets...");
            // Only log in development
            if (self.location.hostname === "localhost") {
                console.log("Pre-caching static assets...");
            }
            return cache.addAll(urlsToCache);
        })
    );
    // Only skip waiting if absolutely necessary (so the new SW takes control immediately)
    // self.skipWaiting();
});

// Activate event - clean up old caches and take control immediately
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [STATIC_CACHE, RUNTIME_CACHE];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        if (self.location.hostname === "localhost") {
                            console.log("Deleting old cache:", cacheName);
                        }
                        return caches.delete(cacheName);
                    }
                    return Promise.resolve();
                })
            );
        }).then(() => {
            // Claim clients to ensure the new service worker takes control
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Only handle GET requests
    if (request.method !== "GET") return undefined;

    // console.log("[ServiceWorker] Fetching:", event.request.url, event.request.mode);
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            // Clone the request and fetch from network
            const fetchRequest = request.clone();

            return fetch(fetchRequest)
                .then((response) => {
                    // Only cache valid responses (status 200 and basic type)
                    if (!response || response.status !== 200 || response.type !== "basic") {
                        return response;
                    }

                    const responseClone = response.clone();

                    return caches.open(RUNTIME_CACHE).then((cache) => {
                        // Avoid caching assets already in static cache
                        if (!urlsToCache.includes(new URL(request.url).pathname)) {
                            console.log("Caching dynamic resource:", request.url);
                            cache.put(request, responseClone);
                        }
                        return response;
                    });
                })
                .catch(() => {
                    // Serve offline fallback for navigation requests
                    if (request.mode === "navigate") {
                        return caches.match(OFFLINE_URL);
                    }

                    // For other types, return a simple fallback
                    return new Response("Offline content not available", {
                        status: 503,
                        headers: { "Content-Type": "text/plain" },
                    });
                });
        })
    );
});

// Handle push notifications
self.addEventListener("push", (event) => {
    const title = "AbuEin Technologies";
    const options = {
        body: event.data.text() || "New update from AbuEin Technologies",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
});