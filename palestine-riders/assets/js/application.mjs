"use strict";

import { buildNav } from "nav";

/**
 * Palestine Riders: App Shell
 * Vanilla ES6+, no frameworks, PWA-ready
 */

// ─── DOM refs ────────────────────────────────────────────────────────────────
const navList = document.getElementById('nav-list');
const pwaStatus = document.getElementById('pwa-status');

// ─── PWA Service Worker ──────────────────────────────────────────────────────
const installServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register("/service-worker.mjs");
        pwaStatus.textContent = '⚡ PWA Ready';
        console.log('[SW] Registered:', reg.scope);
      } catch (err) {
        console.warn('[SW] Failed:', err);
      }
    });
  }
};

// ─── Init ────────────────────────────────────────────────────────────────────
function init() {
  buildNav(navList);
  installServiceWorker();
}

init();