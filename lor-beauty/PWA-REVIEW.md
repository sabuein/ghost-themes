# L'OR Beauty — PWA Feature Review

Companion to `CODE-REVIEW.md` (referenced as CR §x.x — bugs already documented there aren't repeated in full). Scope: `app.webmanifest`, `service-worker.mjs`, `assets/js/pwa/*`, and the PWA-adjacent parts of `default.hbs` and `application.mjs`.

---

## 0. Feature status at a glance

| Feature | State | Blocking issues |
| --- | --- | --- |
| Manifest | ✅ present | JPEG icons fail installability; absolute `start_url`/`id` (CR §4) |
| SW registration | ✅ present | `/service-worker.mjs` likely 404s on Ghost (CR §1.6) — **everything below depends on this** |
| Offline fallback page | ✅ present | `/offline` vs `/offline/` redirect trap (CR §2.3); shell assets not precached (§3 below) |
| Runtime caching | ✅ present | caches error responses & member/admin endpoints, unbounded (CR §2.4); hashed-asset mismatch (§3) |
| Update flow ("Refresh Now" toast) | ⚠ built but defeated | unconditional `skipWaiting()` (CR §1.5); first-install reload (§4) |
| Install prompt capture | ⚠ half-built | event captured, but **no install button exists anywhere** (§5) |
| Push notifications | 💤 scaffold only | no VAPID key, no backend, never called (§6) |
| Background sync | 💤 scaffold only | never called, **and the SW has no `sync` handler** (§6) |
| Offline queue (IndexedDB) | 💤 scaffold only | `storage.mjs` ready; nothing enqueues; contact form is the natural consumer (§6) |
| iOS support | ❌ not considered | no 180px PNG touch icon, no `beforeinstallprompt` fallback (§7) |

Verdict: the architecture is right (register → toast → skip-waiting message; capture → prompt; queue → sync), but three of the six pillars are wired to nothing. Below is what to fix and what to finish, in order.

---

## 1. Prerequisite: the SW must actually be reachable

Everything in this document is moot until CR §1.6 is resolved — confirm on a running instance:

```bash
curl -sI https://your-site/service-worker.mjs | head -3   # want 200 + a JS MIME type
curl -sI https://your-site/app.webmanifest | head -3      # want 200 + application/manifest+json
```

If those 404, fix hosting first (nginx alias or equivalent). Also note the file is registered as a **classic** script (no `type: "module"` in `register()`), so despite the `.mjs` extension it must not contain `import` statements — true today, but it constrains §6 (you can't just `import` `storage.mjs` into it; either inline the IDB code or switch to a module SW and accept the browser-support tradeoff).

---

## 2. Manifest — beyond the CR §4 fixes

After converting icons to PNG and relativizing `start_url`/`id`, consider:

```json
{
    "name": "L'OR Organic - Pure Prickly Pear Seed Oil",
    "short_name": "L'OR",
    "id": "/",
    "start_url": "/",
    "display": "standalone",
    "display_override": ["minimal-ui"],
    "orientation": "portrait-primary",
    "icons": [
        { "src": "/assets/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
        { "src": "/assets/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
        { "src": "/assets/icons/icon-maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
    ],
    "shortcuts": [
        { "name": "Shop", "url": "/shop/", "icons": [{ "src": "/assets/icons/icon-192x192.png", "sizes": "192x192" }] }
    ],
    "screenshots": [
        { "src": "/assets/screenshot-mobile.jpg", "sizes": "390x844", "type": "image/jpeg", "form_factor": "narrow" },
        { "src": "/assets/screenshot-desktop.jpg", "sizes": "1280x800", "type": "image/jpeg", "form_factor": "wide" }
    ]
}
```

- **Drop `"fullscreen"` from `display_override`.** Fullscreen hides the status bar and system UI — wrong for a shop/content site; it was first in the list, so installed users would have gotten it.
- **`shortcuts`** gives long-press/right-click jump targets on the installed icon — Shop is the obvious one.
- **`screenshots`** (with `form_factor`) upgrades Chrome's install prompt to the rich UI. You need the screenshot files anyway for `package.json` (CR §1.8) — reuse them.
- `orientation: portrait-primary` also locks *desktop* window proportions in some UIs; harmless, but you can scope it out if desktop matters.

---

## 3. Caching: the offline page will render broken, and hashed assets never match

Two related gaps beyond CR §2.3/§2.4:

**(a) The offline shell's dependencies aren't precached.** `/offline/` HTML is precached, but its CSS and JS are not — a first-time offline visitor gets unstyled HTML with dead scripts. Precache the shell:

```js
const PRECACHE_ASSETS = [
    "/",
    "/offline/",
    "/app.webmanifest",
    "/assets/css/screen.css",
    "/assets/js/application.mjs",
    // application.mjs's static imports load as separate requests — precache them too:
    "/assets/js/ui/dialog.mjs",
    "/assets/js/ui/toast.mjs",
    "/assets/js/utils/audio.mjs",
    "/assets/js/pwa/register.mjs",
    "/assets/js/pwa/install.mjs",
];
```

(Keep this list in sync with `application.mjs`'s import graph — or add a build-less convention: everything `application.mjs` statically imports gets a line here.)

**(b) Ghost's `{{asset}}` helper appends `?v=<hash>`**, so the page requests `/assets/css/screen.css?v=abc123` while the precache stored `/assets/css/screen.css` — no match, and every theme release strands the old-hash entries in the runtime cache forever. Fix both by ignoring the query for theme assets:

```js
async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const url = new URL(request.url);
    const isThemeAsset = url.pathname.startsWith("/assets/");

    const cached =
        (await cache.match(request)) ||
        (isThemeAsset &&
            (await caches.match(request, { ignoreSearch: true })));
    // ... rest unchanged
}
```

Only do `ignoreSearch` for `/assets/` — for arbitrary URLs the query string is meaningful (`/search?q=…`).

**(c) Bypass range requests** (audio seeks choke on `cache.put`):

```js
if (request.headers.has("range")) return;
```

**(d) Version the caches per release.** `VERSION = "v1"` is manual and will be forgotten. Simplest convention: bump it in the same commit as the `package.json` version, or generate it (`const VERSION = "1.0.0";` mirroring package.json) as part of your zip script.

**(e) Optional: navigation preload** — since navigations are network-first, enabling preload lets the network request start while the SW boots:

```js
// activate:
if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
}
// fetch (navigate branch) — pass the event through:
event.respondWith(networkFirstPage(event));
async function networkFirstPage(event) {
    try {
        const fresh = (await event.preloadResponse) || (await fetch(event.request));
        ...
```

---

## 4. Update lifecycle: one more bug after CR §1.5

Removing `skipWaiting()` from install fixes the toast being useless — but `clients.claim()` still means `controllerchange` fires on the **very first** SW activation, and `register.mjs` reloads the page on a visitor's first ever visit. Only reload when the user actually asked for the update:

```js
// register.mjs
let userRequestedUpdate = false;

// in the toast action:
onClick: () => {
    userRequestedUpdate = true;
    newWorker.postMessage({ type: "SKIP_WAITING" });
},

// and:
navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!userRequestedUpdate || refreshing) return;
    refreshing = true;
    window.location.reload();
});
```

Also worth adding: `registration.update()` on a timer or on `visibilitychange` — Ghost sites are long-session (reading), and the browser only checks for SW updates on navigation:

```js
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") registration.update();
});
```

---

## 5. Install experience: the prompt is captured, then nothing happens

`install.mjs` correctly captures `beforeinstallprompt` and dispatches `lor:pwa-install-available` — but no template renders an install button and nothing listens for the event. `promptInstall()` and `canPromptInstall()` have zero callers. To finish the feature:

**Markup** (footer, or the account area of the header):

```hbs
<button type="button" class="btn btn-secondary" data-pwa-install hidden>
    {{t "Install app"}}
</button>
```

**Wiring** (in `application.mjs`'s bootstrap):

```js
import { promptInstall } from "./pwa/install.mjs";

function initInstallButton() {
    const buttons = document.querySelectorAll("[data-pwa-install]");
    if (!buttons.length) return;

    document.addEventListener("lor:pwa-install-available", () => {
        buttons.forEach((b) => (b.hidden = false));
    });

    buttons.forEach((b) =>
        b.addEventListener("click", async () => {
            const { outcome } = await promptInstall();
            if (outcome === "accepted") buttons.forEach((x) => (x.hidden = true));
        }),
    );

    window.addEventListener("appinstalled", () => {
        buttons.forEach((b) => (b.hidden = true));
    });
}
```

Notes: the button starts `hidden` and only appears when the browser offers installability — correct UX for Firefox/Safari where `beforeinstallprompt` never fires. `deferredPrompt` can only be used once; `install.mjs` already nulls it — good.

---

## 6. Push, background sync, offline queue: decide, then either finish or delete

Right now these three modules ship dead code to every visitor (they're small, but they're also promises the code doesn't keep). Recommendation per module:

**Background sync + queue — finish it; the contact form is the use case.** The pieces exist but aren't connected, and the SW side is entirely missing. The chain should be:

1. `contact-form.mjs` submit → try `fetch`; on failure `enqueue({ url, body, ... })` (from `storage.mjs`) → `registerBackgroundSync(registration)` (from `sync.mjs`) → toast "Message queued, will send when you're back online".
2. `service-worker.mjs` gets the missing handler:

```js
self.addEventListener("sync", (event) => {
    if (event.tag === "lor-beauty-sync") {
        event.waitUntil(replayQueue());
    }
});
```

3. `replayQueue()` needs IDB access *inside the SW* — and the SW is a classic script (§1), so it can't `import` `storage.mjs`. Either inline a ~30-line copy of the IDB helpers in the SW, or register with `{ type: "module" }` and check your browser-support floor first (classic SWs work everywhere; module SWs don't).
4. Fallback for browsers without `sync` (Safari/Firefox): replay the queue on `window` `online` event from the page side — `device.mjs`'s `onConnectivityChange` is sitting there unused and is exactly this hook.

**Push — keep dormant, but honestly.** `push.mjs` needs a VAPID keypair and a subscription-storage backend; Ghost provides neither. Until there's a server (or a third-party push service), nothing on the page should call it. A comment at the top saying "not wired — requires backend, see PWA-REVIEW §6" spares your colleague the search. Note the SW also has no `push`/`notificationclick` handlers — required when this ever goes live.

**Audio "system" backend overlap:** `audio.mjs`'s `playSystemNudge()` requests `Notification` permission for a *sound effect* — that's the permission you'd want to save for real push later, and permission prompts without clear user intent get auto-suppressed by browsers. Suggest removing the auto-request: only play the system backend if permission is *already* granted, never request it from a toast (also see CR §2.6 — `new Notification()` throws on Android anyway).

---

## 7. iOS reality check

- No `beforeinstallprompt` on iOS — the install button from §5 simply never appears there. Fine. If installs matter for the business, add a small "Share → Add to Home Screen" hint shown only on iOS Safari (`isMobile()` from `device.mjs` + `navigator.standalone === false`).
- `apple-touch-icon` currently points at a 192px **JPEG**; iOS wants 180×180 PNG: `<link rel="apple-touch-icon" href="{{asset 'icons/apple-touch-icon.png'}}" sizes="180x180" />`.
- `apple-mobile-web-app-capable` is set — note that installed-from-Safari PWAs get SW support since iOS 16.4, but no push without explicit user install, no background sync ever. The §6 `online`-event fallback covers iOS.

---

## 8. Nice-to-haves (post-launch)

- **Offline indicator**: `onConnectivityChange` → toast "You're offline — pages you've visited are still available" / "Back online". Cheap, high polish, uses two things you already built (`device.mjs`, `toast.mjs`).
- **`navigator.storage.persist()`** after install/consent — asks the browser not to evict the caches under storage pressure.
- **Runtime cache cap** (CR §2.4): after `cache.put`, `keys()` and delete oldest beyond ~60 entries.
- **Precache the 404 page?** No — network-first navigations already fall back correctly; don't cache error pages (CR §2.4 fix prevents it).

---

## 9. Test checklist (before handing to your colleague as "done")

```text
□ curl -I both root files → 200 + correct MIME (§1)
□ Lighthouse → Application/PWA: installable, no manifest warnings
□ DevTools → Application → Service Workers: activates, no console errors
□ DevTools → Network → Offline: navigate to a visited page (cached copy),
  an unvisited page (styled offline page), check offline page buttons work
□ Bump VERSION, reload twice → "A new version is available" toast appears,
  Refresh Now reloads once; first-ever visit does NOT auto-reload (§4)
□ Install on Android Chrome → icon not letterboxed (maskable), shortcut works
□ iOS Safari → Add to Home Screen → correct icon, opens standalone
□ Contact form offline → queued → reconnect → sent (once §6 lands)
□ npm run pwa:check still passes
```

---

## Suggested order

1. §1 reachability (nothing works without it) + CR §1.5/§2.3/§2.4 SW fixes
2. §3 precache shell + `ignoreSearch` for `/assets/`
3. §4 update-flow guard
4. §2 manifest (PNG/maskable icons unblock installability)
5. §5 install button
6. §6 background sync for the contact form; label push as dormant
7. §7–8 polish
