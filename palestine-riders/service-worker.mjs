"use strict";

/**
 * Palestine Riders: Service Worker
 * Cache-first for shell assets, network-first for content
 */

const CACHE_NAME = "palestine-riders-v1";
const SHELL_ASSETS = [
    '/',
    '/assets/css/screen.css',
    '/assets/js/application.mjs',
    '/app.webmanifest',
];

// ── Install: pre-cache shell ──────────────────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS))
    );
    self.skipWaiting();
});

// ── Activate: clean old caches ────────────────────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// ── Fetch: cache-first for shell, network-first for API/media ────────────────
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Shell assets — cache first
    if (SHELL_ASSETS.some(a => url.pathname.endsWith(a.replace('./', '/')))) {
        event.respondWith(
            caches.match(event.request).then(cached => cached || fetch(event.request))
        );
        return;
    }

    // Everything else — network first, fallback to cache
    event.respondWith(
        fetch(event.request)
            .then(res => {
                const clone = res.clone();
                caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                return res;
            })
            .catch(() => caches.match(event.request))
    );
});
