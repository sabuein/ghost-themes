# L'OR Beauty — Code Review (structure + ES6 logic)

Reviewed: all `.hbs` templates, all `.mjs` modules, `package.json`, `app.webmanifest`, `service-worker.mjs`, locales. CSS excluded as requested. Organized by severity; each item has the fix so you can apply it yourself.

---

## 1. Critical — breaks rendering or core behavior

### 1.1 `partials/contact-dialog.hbs` — stray `{{/contentFor}}` with no opener

The file ends with `{{/contentFor}}` but never opens `{{#contentFor "scripts"}}`. An unbalanced block is a Handlebars parse error, and since `footer.hbs` includes this partial, it breaks **every page**. Wrap the script like `cookie-consent.hbs` does:

```hbs
{{#contentFor "scripts"}}
<script type="module">
    import { initContactForm } from "contact";
    initContactForm();
</script>
{{/contentFor}}
```

### 1.2 `hero-section.hbs` + `final-cta.hbs` — broken Shop links

`{{@site.url}}` has **no trailing slash**, so `href="{{@site.url}}shop/"` renders `https://lor.beautyshop/`. In both files:

```hbs
<a href="{{@site.url}}/shop/" class="btn btn-primary">{{t "Shop Now"}}</a>
```

### 1.3 `home.hbs` — "Our authors" section (three bugs)

`authors` doesn't exist in the homepage context (it's a post property), so the loop renders nothing; the `<li>`/`</li>` nesting is malformed; and `aria-labelledby` points at the wrong heading id. Replacement:

```hbs
<section class="home-our-authors" aria-labelledby="home-our-authors-heading">
    <hgroup>
        <h2 id="home-our-authors-heading">{{t "Our authors"}}</h2>
    </hgroup>
    {{#get "authors" limit="all"}}
    <ul class="authors-list">
        {{#foreach authors}}
            <li>
                <h3>{{name}}</h3>
                {{> "social-accounts-this"}}
            </li>
        {{/foreach}}
    </ul>
    {{/get}}
</section>
```

### 1.4 `page-shop.hbs` — `{{title}}`/`{{excerpt}}` outside the page scope

At template root these resolve to nothing, so the shop header renders empty. Wrap the header (or the whole main) in the page block:

```hbs
{{#page}}
<header class="shop-header">
    <h1>{{title}}</h1>
    {{#if excerpt}}<p class="shop-description">{{excerpt}}</p>{{/if}}
</header>
{{/page}}
```

### 1.5 `service-worker.mjs` vs `pwa/register.mjs` — update flow contradicts itself

`register.mjs` shows a "Refresh Now" toast and waits for the user, but the SW's `install` handler calls `self.skipWaiting()` unconditionally — the new SW activates immediately, `controllerchange` fires, and the page force-reloads before anyone sees the toast. Remove the automatic call and keep only the message-driven path:

```js
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS)),
    );
    // no self.skipWaiting() here — the SKIP_WAITING message handler covers it
});
```

### 1.6 Root files Ghost won't serve: `/service-worker.mjs`, `/app.webmanifest`, `/humans.txt`

Ghost serves `robots.txt` from the theme root, but not arbitrary files — requests to `/service-worker.mjs` and `/app.webmanifest` will get the 404 HTML page (SW registration fails; manifest invalid). Verify on your instance (`curl -I https://yoursite/service-worker.mjs`). If 404, the usual options:

- Self-hosted: an nginx `location` rule aliasing those two paths into the theme folder (make sure `.mjs` is served as `application/javascript` and add `Service-Worker-Allowed: /` if you ever serve the SW from `/assets/`).
- Or move the SW to `assets/js/service-worker.mjs` and register with `scope: "/"` — this **requires** the `Service-Worker-Allowed: /` response header, so it's still a hosting-level change.

Same issue for `<link rel="author" href="{{@site.url}}/humans.txt">` in `default.hbs`.

### 1.7 `author.hbs` — references to partials that don't exist

There is no `partials/brands/` (or `partials/icons/`) directory, so `{{> "brands/x"}}` / `{{> "brands/facebook"}}` throw "partial could not be found" the moment an author has Twitter/Facebook set. Either create those partials or use the fallback partial-block form you already use in the social-accounts partials:

```hbs
{{#> "brands/x"}}<span class="icon icon-web">X</span>{{/undefined}}
```

Related: because `partials/icons/` doesn't exist, the social-accounts partials always render the text fallback — worth creating the icon partials when ready.

### 1.8 Missing theme assets referenced elsewhere

- `{{asset 'favicon.ico'}}` in `default.hbs` → `assets/favicon.ico` does not exist → 404.
- `package.json` `screenshots` points to `assets/screenshot-desktop.jpg` / `assets/screenshot-mobile.jpg` — neither exists (gscan will flag).

---

## 2. Logic bugs in the ES6 modules

### 2.1 `ui/dialog.mjs` — duplicate click listeners; `lor:dialog-before-open` fires *after* open

`initDialogs()` registers **two** click listeners per trigger. The first opens the dialog immediately, so by the time the second dispatches `lor:dialog-before-open`, the dialog is already open (and its `openDialog` call no-ops). Delete the first listener entirely and keep only the payload one:

```js
root.querySelectorAll("[data-dialog-open]").forEach((trigger) => {
    if (trigger.dataset.dialogTriggerWired) return;
    trigger.dataset.dialogTriggerWired = "true";

    trigger.addEventListener("click", () => {
        const id = trigger.dataset.dialogOpen;
        const dialog = document.getElementById(id);
        if (!(dialog instanceof HTMLDialogElement)) return;

        let payload = null;
        try {
            payload = trigger.dataset.dialogPayload
                ? JSON.parse(trigger.dataset.dialogPayload)
                : null;
        } catch {
            payload = null;
        }

        dialog.dispatchEvent(
            new CustomEvent("lor:dialog-before-open", {
                bubbles: true,
                detail: { trigger, payload },
            }),
        );

        openDialog(id);
    });
});
```

### 2.2 `application.mjs` — modules that are never initialized

- `initPopovers()` is never called, so `popover.mjs`'s whole reason to exist (closing the mobile nav when a link is tapped) never runs.
- `initTheme()` is never called — the inline script in `default.hbs` handles first paint only; OS-preference *changes* are never followed.
- The header's `data-sound-toggle` button is completely unwired — nothing imports `toggleMuted()`, and `aria-pressed` never updates.

Suggested `bootstrap()`:

```js
import { initDialogs } from "./ui/dialog.mjs";
import { initPopovers } from "./ui/popover.mjs";
import { registerServiceWorker } from "./pwa/register.mjs";
import { initInstallPrompt } from "./pwa/install.mjs";
import { initTheme } from "./utils/theme.mjs";
import { isMuted, toggleMuted } from "./utils/audio.mjs";

function initSoundToggle() {
    document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
        button.setAttribute("aria-pressed", String(!isMuted()));
        button.addEventListener("click", () => {
            const muted = toggleMuted();
            button.setAttribute("aria-pressed", String(!muted));
        });
    });
}

async function bootstrap() {
    initTheme();
    initDialogs();
    initPopovers();
    initSoundToggle();
    initInstallPrompt();
    await registerServiceWorker();
}
```

### 2.3 `service-worker.mjs` — offline URL redirect trap

`PRECACHE_ASSETS` uses `"/offline"`, but Ghost's page URL is `/offline/` — the precache fetch follows a 301, and serving a redirected response for a navigation request throws a network error in Chrome. Use the canonical URL:

```js
const OFFLINE_URL = "/offline/";
```

(And remember the Offline page must actually exist in Ghost Admin with slug `offline` for `page-offline.hbs` to be used.)

### 2.4 `service-worker.mjs` — caches error responses, and caches too much

- `networkFirstPage` calls `cache.put()` on any response, including 404/500 pages, which then get served as "cached content" while offline. Guard it: `if (fresh.ok) { ... cache.put(...) }`.
- The fetch handler applies stale-while-revalidate to **every** same-origin GET, including Ghost admin and member endpoints. Bypass them:

```js
if (
    url.pathname.startsWith("/ghost/") ||
    url.pathname.startsWith("/members/") ||
    url.pathname.startsWith("/r/")
) {
    return; // let the network handle it
}
```

- The runtime cache grows without bound; consider a simple max-entries trim after `cache.put()`.

### 2.5 `utils/storage.mjs` — `dequeueAll()` race + poisoned `dbPromise`

`peekQueue()` and `clear()` run in separate transactions, so anything enqueued between them is silently lost. Do both in one transaction:

```js
export function dequeueAll() {
    return openDatabase().then(
        (db) =>
            new Promise((resolve, reject) => {
                const tx = db.transaction("sync-queue", "readwrite");
                const store = tx.objectStore("sync-queue");
                const getAll = store.getAll();
                getAll.addEventListener("success", () => {
                    const items = getAll.result;
                    store.clear();
                    tx.addEventListener("complete", () => resolve(items));
                });
                tx.addEventListener("error", () => reject(tx.error));
            }),
    );
}
```

Also: if `indexedDB.open` fails once, `dbPromise` stays rejected forever. Add `dbPromise = null;` in a `.catch` (or before `reject`) so a later call can retry.

### 2.6 `utils/audio.mjs` — two smaller notes

- `playSystemNudge()` uses `new Notification(...)`, which throws on Android Chrome (it requires `registration.showNotification()`). Your `catch` falls back to the tone, so it works — but "system" backend will effectively never work on Android; worth a comment or routing through the SW registration.
- Each `playToneNudge()` creates a new `AudioContext`. Browsers cap concurrent contexts; consider one lazily-created, reused context.

### 2.7 `utils/haptics.mjs` — unguarded `localStorage`

`isHapticsEnabled`/`setHapticsEnabled` call `localStorage` directly and will throw in privacy modes — inconsistent with `audio.mjs`'s `safeStorageGet/Set`. Wrap in try/catch the same way.

---

## 3. Ghost conventions & template structure

### 3.1 Cookie consent only exists on the homepage

`{{> "cookie-consent"}}` is included in `home.hbs` only — a visitor landing on a post or the shop never sees the consent dialog. Move the include to `default.hbs` (e.g. next to the footer), and move the always-visible "Cookie consent" re-open button into `footer.hbs` where it belongs visually.

Also inconsistent: the dialog copy links `/cookie-policy` but the *Manage preferences* button navigates to `/privacy/` (`cookies.mjs` line 69). Pick one URL.

Note `canRunOptionalScripts()` is exported but nothing consumes it yet — when you add analytics, remember to gate them on it and on the `lor:consent-changed` event.

### 3.2 `author.hbs` cleanup

- `alt="{{title}}"` on the cover image — authors have no `title`; use `{{name}}`.
- The `{{#is "author"}}` wrapper is redundant; author.hbs only renders in the author context.
- srcset descriptors don't match your `image_sizes`: `size="l"` is 1200px but declared as `1000w`. Use `1200w`.

### 3.3 `partials/navigation.hbs` — remove `role="menu"` / `role="menuitem"`

ARIA menu roles are for application menus (with arrow-key behavior you'd have to implement) and actively hurt screen-reader navigation of plain links. A `<nav><ul><li><a>` structure needs no roles at all.

### 3.4 `partials/user/profile-dropdown.hbs` — `href="javascript:"`

Blocked by any sensible CSP and meaningless to assistive tech. Ghost only needs the attribute:

```hbs
<a href="#" data-members-signout>{{t "Log Out"}}</a>
```

(or a `<button>` styled as a link).

### 3.5 `post.hbs` — raw `feature_image` and thin markup

Use `img_url` with srcset like you already do in `author.hbs`, so the 2MB original isn't shipped to phones:

```hbs
{{#if feature_image}}
    <img
        srcset="{{img_url feature_image size="s"}} 300w,
                {{img_url feature_image size="m"}} 600w,
                {{img_url feature_image size="l"}} 1200w"
        sizes="(max-width: 700px) 100vw, 700px"
        src="{{img_url feature_image size="l"}}"
        alt="{{title}}"
    />
{{/if}}
```

Same applies to `post-product.hbs` and `product-card.hbs` (`{{feature_image}}` raw).

### 3.6 `default.hbs` head details

- The `preload` for `screen.css` is pointless — the stylesheet `<link>` is right below it in the same head. Remove one (keep the stylesheet).
- The two `prefetch` hints for portal/sodo-search pin versions (`@~2.37`, `@~1.1`) that may not match what Ghost actually injects — you can end up downloading each script twice. Suggest removing them and trusting `{{ghost_head}}`.
- `<script type="text/javascript">` → just `<script>`.
- The importmap defines `dialog`, `popover`, `toast` that no inline script uses, while `application.mjs` uses relative paths. Harmless, but pick one convention (I'd drop the unused entries).
- Consider a skip link as first element of `<body>`: `<a class="skip-link" href="#main-content">{{t "Skip to content"}}</a>` (and put `id="main-content"` on each template's `<main>`).

### 3.7 `home.hbs` — leftover debug script

The `{{#contentFor "scripts"}}` block with `console.log("Welcome to ...")` should go before release.

### 3.8 Localization gaps

Templates call `{{t}}` with keys missing from both locale files, and other partials hardcode English entirely:

- Missing keys used via `{{t}}`: "Our authors", "Shop Now", "Featured Product", "Menu", "Primary", "Secondary", "Account", "My Account", "Log Out", "Sign In", "Toggle notification sounds", "Why shop with us", "Ready to try it for yourself?", "No products available at the moment.", "You're Currently Offline", "It looks like you've lost your internet connection…", "Try Again", "No social accounts connected yet.".
- Case mismatch: `home.hbs` uses `{{t "Latest posts"}}` but the locale key is `"Latest Posts"` — the Spanish translation will never match.
- No `{{t}}` at all: `trust-strip`, `why-it-works`, `how-to-use`, `social-proof`, `product-card` ("View Product"), `post-product` (all sections), `cookie-consent`, `contact-dialog`, `error-404`, footer's "Contact" button.

Missing keys fall back to the literal English string, so nothing breaks — but the `es.json` file is currently mostly translating Casper-era strings you don't use.

### 3.9 `post-product.hbs` — content notes

- Typo: "untilfully absorbed" → "until fully absorbed"; also "2&mdash;3 drops" (em dash) vs how-to-use's "2–3" (en dash).
- Price is hardcoded in two places (`post-product.hbs`, `product-card.hbs`). Until a real commerce layer exists, a [custom theme setting](https://docs.ghost.org/themes/custom-settings) (`@custom.default_price`) or a `#price-150` internal tag would keep it in one place.
- The hardcoded reviews duplicate `social-proof.hbs` — consider extracting a `testimonials` partial used by both.
- "← Back to Shop" hardcodes `/shop/` — fine, but `{{@site.url}}/shop/` keeps it subdirectory-safe.

### 3.10 `error-404.hbs` — untranslated + minimal

Hardcoded English (no `{{t}}`); consider also surfacing recent posts with a `{{#get "posts" limit="3"}}` so the dead end has somewhere to go.

---

## 4. PWA manifest

- **Icons are JPEG.** Chromium's installability check wants PNG at 192 and 512 (JPEG also can't do transparency). Convert both to PNG, update `type`, and add a `"purpose": "maskable"` variant so Android doesn't letterbox the icon.
- `start_url` and `id` are pinned to `https://lor.beauty/` — on localhost/staging that makes the manifest invalid for the current origin. Use relative values: `"id": "/"`, `"start_url": "/"`.
- `"lang": "en"` is static while the site locale is dynamic — fine for now, just noting it.
- `theme_color` `#c9a45c` matches the meta tag — good. You could add a dark-scheme variant meta: `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a2e1f" />`.

---

## 5. Things that are good (no action)

- Clean module layout (`pwa/` / `ui/` / `utils/`), no framework, consistent `lor:*` event vocabulary across dialog/popover/consent — nice foundation for a theme meant to be extended.
- Native `<dialog>` + Popover API usage with minimal JS on top is exactly right, and the `{{/undefined}}` dynamic-partial-block close in the social-accounts partials is the correct (if obscure) Handlebars workaround.
- `{{#social_accounts}}` is a real Ghost helper (docs: https://docs.ghost.org/themes/helpers/data/social_accounts) — the three thin wrapper partials around it are a good pattern.
- Defensive `try/catch` around `localStorage` in `cookies.mjs`/`audio.mjs`, the FOUC-prevention inline theme script, and the `home.hbs` vs `index.hbs` split with clear comments are all solid.
- `pwa:check` npm scripts are a nice touch; consider adding a `curl`-based check that the SW/manifest URLs actually resolve on a running instance (see 1.6).

---

## Suggested fix order

1. `contact-dialog.hbs` stray `{{/contentFor}}` (breaks every page)
2. Shop links (`{{@site.url}}/shop/`) and `page-shop.hbs` scope
3. `home.hbs` authors section
4. `dialog.mjs` duplicate listener
5. SW: remove auto `skipWaiting()`, `/offline/`, `fresh.ok` guard, admin/member bypass
6. Verify root-file serving (1.6) — everything PWA depends on it
7. `application.mjs` init gaps (popovers, theme, sound toggle)
8. favicon + screenshots, manifest PNG icons
9. The rest at leisure
