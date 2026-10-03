/*
  service-worker.mjs — starter-kit
  Classic service worker (no imports), so register it WITHOUT { type: "module" }.

  Strategies
    • Pages (navigations) ...... network-first → cached copy → /offline/
    • /assets/ with ?v=hash .... cache-first (Ghost's {{asset}} hash changes on every theme upload)
    • /assets/ without ?v ...... stale-while-revalidate (e.g. files loaded through the import map)
    • Images ................... stale-while-revalidate, capped
    • Never touched ............ non-GET, other origins, Ghost Admin, Members API, previews,
                                 link redirects, RSS/sitemaps, and range (video) requests

  Bump VERSION whenever you change this file; old caches are removed on activate.
*/
"use strict";

const VERSION = "v3";
const PREFIX = "starter-kit";

const CACHES = {
    core: `${PREFIX}-core-${VERSION}`,      // precached shell: never trimmed
    static: `${PREFIX}-static-${VERSION}`,
    pages: `${PREFIX}-pages-${VERSION}`,
    images: `${PREFIX}-images-${VERSION}`
};

const LIMITS = {
    [CACHES.static]: 80,
    [CACHES.pages]: 30,
    [CACHES.images]: 60
};

// Create a Ghost page with the slug "offline" and the template "custom-offline".
const OFFLINE_URL = "/offline/";

const PRECACHE = [
    OFFLINE_URL,
    "/app.webmanifest",
    "/assets/css/screen.css",
    "/assets/js/application.mjs"
];

const BYPASS = /^\/(ghost|members|\.ghost|p|r|email|unsubscribe|webmentions)(\/|$)|\/(rss\/?|sitemap[^/]*\.xml)$/;

/* ---------- helpers ---------- */

const trimCache = async (cacheName, max) => {
    if (!max) return;
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const excess = keys.length - max;
    if (excess > 0) await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
};

// Only store complete, public, same-origin responses.
// Ghost sends "private"/"no-store" for signed-in member pages, so those are skipped.
const putSafe = async (cacheName, request, response) => {
    if (!response || !response.ok || response.type !== "basic") return;
    if (/no-store|private/i.test(response.headers.get("Cache-Control") ?? "")) return;
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
    await trimCache(cacheName, LIMITS[cacheName]);
};

const offlineResponse = () => new Response(
    "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width'><title>Offline</title><p>You are offline. Please check your connection and try again.</p>",
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
);

/* ---------- strategies ---------- */

const networkFirst = async (event) => {
    const { request } = event;
    try {
        const response = (await event.preloadResponse) ?? (await fetch(request));
        event.waitUntil(putSafe(CACHES.pages, request, response.clone()));
        return response;
    } catch {
        return (await caches.match(request, { ignoreSearch: true }))
            ?? (await caches.match(OFFLINE_URL))
            ?? offlineResponse();
    }
};

const cacheFirst = async (event, cacheName) => {
    const { request } = event;
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    event.waitUntil(putSafe(cacheName, request, response.clone()));
    return response;
};

const staleWhileRevalidate = async (event, cacheName) => {
    const { request } = event;
    const network = fetch(request).then(async (response) => {
        await putSafe(cacheName, request, response.clone());
        return response;
    });
    event.waitUntil(network.catch(() => {})); // keep the worker alive for the background update
    const cached = await caches.match(request);
    return cached ?? network;
};

/* ---------- lifecycle ---------- */

self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHES.core);
        // allSettled: one missing file must not abort the whole install
        const results = await Promise.allSettled(
            PRECACHE.map((url) => cache.add(new Request(url, { cache: "reload" })))
        );
        results.forEach((result, i) => {
            if (result.status === "rejected") console.warn("[SW] Could not precache", PRECACHE[i]);
        });
    })());
});

self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        const keep = new Set(Object.values(CACHES));
        const keys = await caches.keys();
        await Promise.all(
            keys.filter((key) => !keep.has(key)) // also clears caches left by older workers
                .map((key) => caches.delete(key))
        );
        if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
        await self.clients.claim();
    })());
});

/* ---------- routing ---------- */

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET" || request.headers.has("range")) return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin || BYPASS.test(url.pathname)) return;

    if (request.mode === "navigate") {
        event.respondWith(networkFirst(event));
        return;
    }

    if (url.pathname.startsWith("/assets/")) {
        event.respondWith(url.searchParams.has("v")
            ? cacheFirst(event, CACHES.static)
            : staleWhileRevalidate(event, CACHES.static));
        return;
    }

    if (request.destination === "image") {
        event.respondWith(staleWhileRevalidate(event, CACHES.images));
    }
});

/* ---------- messages & push ---------- */

self.addEventListener("message", (event) => {
    switch (event.data?.type) {
        case "SKIP_WAITING":
            self.skipWaiting();
            break;
        case "CLEAN_UP":
            event.waitUntil(Promise.all(
                Object.entries(LIMITS).map(([name, max]) => trimCache(name, max))
            ));
            break;
    }
});

self.addEventListener("push", (event) => {
    let data = {};
    try { data = event.data?.json() ?? {}; }
    catch { data = { message: event.data?.text() }; }

    event.waitUntil(self.registration.showNotification(data.title ?? "New update", {
        body: data.message ?? "",
        icon: data.icon ?? "/assets/images/android/android-launchericon-192-192.png",
        data: { url: data.url ?? "/" }
    }));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const target = new URL(event.notification.data?.url ?? "/", self.location.origin).href;
    event.waitUntil((async () => {
        const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        const open = windows.find((client) => client.url === target);
        return open ? open.focus() : self.clients.openWindow(target);
    })());
});