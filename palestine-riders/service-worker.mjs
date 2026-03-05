"use strict";

/**
 * Palestine Riders: Service Worker
 * Cache-first for shell assets, network-first for content
 */

const CACHE_NAME = "palestine-riders-v1";
const SHELL_ASSETS = [
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
    const req = event.request;
    const url = new URL(req.url);

    // 1) Navigations (HTML pages) - network first, DON'T cache
    if (req.mode === 'navigate') {
        event.respondWith(fetch(req).catch(() => caches.match('/')));
        return;
    }

    // 2) Static assets - cache first
    if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
        event.respondWith(
            caches.match(req, { ignoreSearch: true }).then(cached => cached || fetch(req))
        );
        return;
    }

    // 3) Everything else - network first, cache ok (optional)
    event.respondWith(
        fetch(req)
            .then(res => {
                // optionally cache only GET and only same-origin
                if (req.method === 'GET' && url.origin === self.location.origin) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(req, clone));
                }
                return res;
            })
            .catch(() => caches.match(req))
    );
});
