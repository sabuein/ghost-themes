"use strict";

const appName = "starter-kit-",
    version = "v1:",
    sw_caches = {
        assets: {
            name: `${appName}${version}assets`,
            images: {
                name: `${appName}${version}images`,
                limit: 50
            },
            cars: {
                name: `${appName}${version}videos`,
                limit: 10
            }
        }
    },
    /*INITIAL_APP_FONTS = [
        "/assets/fonts/epilogue-v17-latin-100.woff",
        "/assets/fonts/epilogue-v17-latin-100.woff2",
        "/assets/fonts/epilogue-v17-latin-100.ttf",
        "/assets/fonts/epilogue-v17-latin-100.svg",
        "/assets/fonts/epilogue-v17-latin-300.woff",
        "/assets/fonts/epilogue-v17-latin-300.woff2",
        "/assets/fonts/epilogue-v17-latin-300.ttf",
        "/assets/fonts/epilogue-v17-latin-300.svg",
        "/assets/fonts/epilogue-v17-latin-regular.woff",
        "/assets/fonts/epilogue-v17-latin-regular.woff2",
        "/assets/fonts/epilogue-v17-latin-regular.ttf",
        "/assets/fonts/epilogue-v17-latin-regular.svg",
        "/assets/fonts/epilogue-v17-latin-500.woff",
        "/assets/fonts/epilogue-v17-latin-500.woff2",
        "/assets/fonts/epilogue-v17-latin-500.ttf",
        "/assets/fonts/epilogue-v17-latin-500.svg",
        "/assets/fonts/epilogue-v17-latin-700.woff",
        "/assets/fonts/epilogue-v17-latin-700.woff2",
        "/assets/fonts/epilogue-v17-latin-700.ttf",
        "/assets/fonts/epilogue-v17-latin-700.svg",
    ],*/
    //OFFLINE_URL = "/offline/",
    INITIAL_CACHED_RESOURCES = [
        //OFFLINE_URL,
        "app.webmanifest",
        "assets/css/screen.css",
        "assets/css/breakpoints.css",
        "assets/css/pwa.css",
        //"assets/favicon.ico",
        "assets/js/application.mjs",
        "assets/js/modules/helpers.mjs",
        "assets/js/modules/view.mjs",
        "https://cdn.jsdelivr.net/ghost/portal@~2.37/umd/portal.min.js",
        "https://cdn.jsdelivr.net/ghost/sodo-search@~1.1/umd/sodo-search.min.js",
    ];
//INITIAL_CACHED_RESOURCES.push(...INITIAL_APP_FONTS);

// install event handler (note async operation)
// opens named cache, pre-caches identified resources above
self.addEventListener("install", event => {
    console.log("[Service Worker]: install event in progress...");
    // Cache on install to improve performance
    event.waitUntil(
        (async () => {
            const cache = await caches.open(sw_caches.assets.name);
            console.log("[Service Worker]: caching initial resources...");
            await cache.addAll(INITIAL_CACHED_RESOURCES);
        })(),
    );
});

self.addEventListener("activate", event => {
    console.log("[Service Worker]: activation event in progress...");
    const cacheWhitelist = [sw_caches.assets.name];
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => {
                    return !key.startsWith(`${appName}${version}`);
                }).map(key => {
                    return caches.delete(key);
                }).map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => clients.claim()));
    console.log("[Service Worker]: all clients are now controlled by me! Mwahahaha!");
});

// We have a cache-first strategy, 
// where we look for resources in the cache first
// and only on the network if this fails.
self.addEventListener("fetch", event => {
    // Destination gives us a clue as to the type of resource
    const destination = event.request.destination;
    /*
    switch (destination) {
        case "image":
            event.respondWith(
                // check the cache first,
                // fall back to the network
                // and store a copy in 
                // sw_caches.images.name
            );
            break;
        case "document":
            event.respondWith(
                // check the network first
                // and store a copy in
                // sw_caches.pages.name,
                // fall back to the cache
            );
            break;
        default:
            event.respondWith(
                // network only
            );
        }
    */

    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(async () => {
                return caches.open(sw_caches.assets.name).then((cache) => {
                    return cache.match(OFFLINE_URL);
                });
            })
        );
    } else if (event.request.destination === "style" || event.request.destination === "script" || event.request.destination === "image" || event.request.destination === "font") {
        console.log(`[Service Worker]: fetching resource of destination style/script/image/font...`);
        fetchCacheFirst(event);
    } else {
        fetchCacheFirst(event);
    }
});

const fetchCacheFirst = (event) => {
    try {
        // Cache-first on (fetch) retrieval
        const CACHE_NAME = sw_caches.assets.name;
        event.respondWith(
            (async () => {

                const cache = await caches.open(CACHE_NAME);

                // Try the cache first.
                const cachedResponse = await cache.match(event.request);
                if (cachedResponse !== undefined) {
                    console.log(`[Service Worker]: fetching resource (${event.request.url})...`);
                    // Cache hit, let's send the cached resource.
                    return cachedResponse;
                } else {
                    // Nothing in cache, let's go to the network.
                    const response = await fetch(event.request);
                    console.log(`[Service Worker]: caching new resource (${event.request.url})...`);
                    cache.put(event.request, response.clone());
                    return response;
                }
            })(),
        );
    } catch (error) {
        console.log(error);
    }
};

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "IS_OFFLINE") {
        console.log("[Service Worker]: the network connection was lost.");
    }

    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }

    if (event.data && event.data.type === "CLEAN_UP") {
        for (let key in sw_caches) {
            if (sw_caches[key].limit != undefined) {
                trimCache(sw_caches[key].name, sw_caches[key].limit);
            }
        }
    }
});

self.addEventListener("push", event => {
    console.log("[Service Worker]: received notification...", event.data);

    const notificationData = JSON.parse(event.data.text());

    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.message,
            icon: notificationData.icon
        }));
});

const trimCache = (cache_name, limit) => {
    caches.open(cache_name).then(cache => {
        cache.keys().then(items => {
            if (items.length > limit) {
                (async () => {
                    let i = 0, end = items.length - limit;
                    while (i < end) {
                        console.log(`[Service Worker]: deleting resource (${i}-${items[i]}).`);
                        cache.delete(items[i++]);
                    }
                })();
            }
        });
    });
};