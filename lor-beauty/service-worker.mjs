const VERSION = "v1";
const STATIC_CACHE = `lor-beauty-static-${VERSION}`;
const RUNTIME_CACHE = `lor-beauty-runtime-${VERSION}`;
const OFFLINE_URL = "/offline";

const PRECACHE_ASSETS = ["/", OFFLINE_URL, "/app.webmanifest"];

// ---------- Install ----------
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_ASSETS)),
    );
    self.skipWaiting();
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
});

// ---------- Fetch ----------
self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // HTML navigation: network-first with offline fallback
    if (request.mode === "navigate") {
        event.respondWith(networkFirstPage(request));
        return;
    }

    // Static assets: stale-while-revalidate
    event.respondWith(staleWhileRevalidate(request));
});

async function networkFirstPage(request) {
    try {
        const fresh = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, fresh.clone());
        return fresh;
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
    const cached = await cache.match(request);

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