const VERSION = "1.0.0";
const STATIC_CACHE = `lor-beauty-static-${VERSION}`;
const RUNTIME_CACHE = `lor-beauty-runtime-${VERSION}`;
const OFFLINE_URL = "/offline/";

const PRECACHE_ASSETS = [
    "/",
    OFFLINE_URL,
    "/app.webmanifest",
    "/assets/css/screen.css",
    "/assets/js/application.mjs",
    "/assets/js/ui/dialog.mjs",
    "/assets/js/ui/toast.mjs",
    "/assets/js/utils/audio.mjs",
    "/assets/js/pwa/register.mjs",
    "/assets/js/pwa/install.mjs",
];

// ---------- Install ----------
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_ASSETS)),
    );
    // no self.skipWaiting() here; the SKIP_WAITING message handler covers it
    // This fixes the toast being useless    
    // self.skipWaiting();
});

// ---------- Activate ----------
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names
                    .filter(
                        (name) => ![STATIC_CACHE, RUNTIME_CACHE].includes(name),
                    )
                    .map((name) => caches.delete(name)),
            );
            await self.clients.claim();
        })(),
    );
    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
    }
});

// ---------- Fetch ----------
self.addEventListener("fetch", (event) => {
    const { request } = event;

    // let the network handle it
    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (
        url.pathname.startsWith("/ghost/") ||
        url.pathname.startsWith("/members/") ||
        url.pathname.startsWith("/r/")
    ) {
        return;
    }

    // Bypass range requests
    if (request.headers.has("range")) return;

    // HTML navigation: network-first with offline fallback
    if (request.mode === "navigate") {
        event.respondWith(networkFirstPage(event));
        return;
    }

    // Static assets: stale-while-revalidate
    event.respondWith(staleWhileRevalidate(request));
});

self.addEventListener("sync", (event) => {
    if (event.tag === "lor-beauty-sync") {
        event.waitUntil(replayQueue());
    }
});

async function networkFirstPage(event) {
    try {
        const fresh = (await event.preloadResponse) || (await fetch(event.request));
        const cache = await caches.open(RUNTIME_CACHE);
        if (fresh.ok) {
            cache.put(request, fresh.clone());
            return fresh;
        }
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;

        const offline = await caches.match(OFFLINE_URL);
        if (offline) return offline;

        return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
        });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const url = new URL(request.url);
    const isThemeAsset = url.pathname.startsWith("/assets/");
    const cached =
        (await cache.match(request)) ||
        (isThemeAsset && (await caches.match(request, { ignoreSearch: true })));

    const fetchPromise = fetch(request)
        .then((response) => {
            if (response && response.status === 200) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    return cached || (await fetchPromise) || new Response("", { status: 504 });
}

// ---------- Optional: immediate activation message ----------
self.addEventListener("message", (event) => {
    if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
