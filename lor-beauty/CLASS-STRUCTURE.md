# L'OR Beauty — HTML Structure & Class Architecture Audit

Goal: make the markup styling-ready so writing CSS later is mechanical, not archaeological. No CSS here — only structure, naming, and hooks. Apply after (or together with) `HTML-IMPROVEMENTS.md`.

---

## 1. Current state, in one look

Your de-facto convention is **flat kebab-case "block-element"** (`site-header-inner`, `product-card-title`, `toast-close`) — a good, framework-free choice. Keep it. The problems are the exceptions, not the convention:

| Problem | Where |
| --- | --- |
| Same class, two meanings | `product-grid` = card grid (`page-shop.hbs`) **and** image/info layout (`post-product.hbs`) |
| Three names, one concept (card grid) | `product-grid` (shop), `post-grid` (tag), `post-list` (index/home/author) |
| Three names, one concept (Ghost content wrapper) | `post-content` (post), `page-content` (page), `content-wrapper` (product) |
| Three dialog styling surfaces | `lor-dialog-*` (dialog.hbs + contact), no class at all (cookie-consent), `transient-dialog-*` (dialog.mjs) |
| Casper leftovers | `post-card-image-link`, `post-card-image` in `author.hbs` — used nowhere else |
| Same concept, different blocks | `review` (post-product) vs `testimonial-item` (social-proof) |
| Missing block class | `<dialog id="contact-dialog">` uses `lor-dialog-header/body/actions` children but the dialog itself has no `lor-dialog` class; same for `#cookie-consent` |
| Inconsistent page wrappers | `post-index` (no `-page` suffix) vs `home-page`, `post-page`…; bare `page` on page.hbs is dangerously generic |
| Container placement varies | on `<main>` (post, page, tag, author, error, offline), inner `<div>` (shop, product), per-section (home partials), **missing entirely** (index.hbs) |
| Buttons unevenly classed | `btn btn-primary` on CTAs, but footer Contact, cookie actions, dialog actions, and form buttons have no `btn` class |

---

## 2. Naming convention (write this down in README)

- **Block** = component/partial name: `product-card`, `site-header`, `toast`, `lor-dialog`.
- **Element** = `block-noun`: `product-card-title`, `toast-message`. Nouns only.
- **Modifier/variant** = `block-adjective` as an *additional* class next to the block: `toast toast-error`, `btn btn-primary`, `nav-list nav-list-secondary`. Adjectives only — this is how you tell them apart from elements.
- **State** = never a bespoke class. Style off what the platform already maintains:
  - `dialog[open]`, `:popover-open`, `[aria-pressed="true"]`, `[aria-expanded="true"]`, `[aria-current="page"]`, `[disabled]`, `:user-invalid` / `:user-valid` (forms), `html[data-theme="dark"]`
  - Consequence: `nav-current` is redundant with `[aria-current="page"]` — drop the class, keep the attribute.
- **JS hooks** = `data-*` only (`data-dialog-open`, `data-sound-toggle`, `data-cookie-action`) — you already do this well. Rule: JS never queries classes, CSS never styles `data-*` behavior hooks (or wired-marker datasets like `data-dialog-wired`).
- **Don't class everything.** CSS nesting is baseline now — `li` under `.authors-list` or `p` under `.trust-strip-item` needs no class. Only class what's a reusable block, an element you'll target across contexts, or a variant. (This is why `authors-list` having unclassed `<li>`s is fine while `trust-strip-item` is also fine — both are legitimate; just don't feel obligated to add `-item` classes everywhere.)

---

## 3. Rename map (old → new)

Templates:

| File | Old | New | Why |
| --- | --- | --- | --- |
| `post-product.hbs` | `product-grid` | `product-layout` | collision with shop card grid |
| `page-shop.hbs` | `product-grid` | `card-grid` | one grid primitive for all card grids |
| `tag.hbs` | `post-grid` | `card-grid` | same primitive (it holds product cards and article cards) |
| `post.hbs` | `post-content` | `gh-content` | single scope for Ghost-rendered content |
| `page.hbs` | `page-content` | `gh-content` | 〃 |
| `post-product.hbs` | `content-wrapper` | `gh-content` | 〃 |
| `page.hbs` | `page` | `page-default` | `.page` is too generic; Ghost's `body_class` already provides `.page-template` |
| `index.hbs` | `post-index` | `index-page` | align with the `*-page` suffix everywhere else |
| `author.hbs` | `post-card-image-link` | `author-cover` | Casper leftover |
| `author.hbs` | `post-card-image` | `author-cover-image` | 〃 |
| `post-product.hbs` | `review` | `testimonial` | align with `testimonial-item`; better: extract a shared `testimonials` partial used by both `social-proof.hbs` and `post-product.hbs` |
| `navigation.hbs` | `nav-current` | *(delete)* | `[aria-current="page"]` is the styling hook |
| `contact-dialog.hbs` | *(none on `<dialog>`)* | add `lor-dialog` | children already use `lor-dialog-*` |
| `cookie-consent.hbs` | *(none on `<dialog>`)* | add `lor-dialog cookie-consent` | shared dialog skin + block for specifics |
| `cookie-consent.hbs` | `cookie-consent-actions` | `lor-dialog-actions` | one actions row style for all dialogs |

JS (`assets/js/ui/dialog.mjs` — `buildTransientDialog`):

| Old | New |
| --- | --- |
| `transient-dialog` | `lor-dialog lor-dialog-transient` |
| `transient-dialog-message` | `lor-dialog-message` |
| `transient-dialog-actions` | `lor-dialog-actions` |

Result: **every** `<dialog>` in the theme — authored, cookie, contact, or JS-built — is skinned once via `.lor-dialog` and its elements, with variants layered on top.

Buttons — add the `btn` family where missing so one button system covers the theme:

| Where | Suggested |
| --- | --- |
| Footer "Contact" + "Cookie settings" | `btn btn-ghost` (or `btn-link` — pick one low-emphasis variant) |
| Cookie actions | accept `btn btn-primary`, decline/manage `btn btn-secondary` |
| Dialog actions (dialog.hbs, contact form, transient dialogs in dialog.mjs) | confirm/submit `btn btn-primary`, cancel `btn btn-secondary` |
| `toast-action`, `toast-close` | leave as toast elements — they're part of the toast block, not general buttons |

---

## 4. Container & layout rule

Pick one rule and apply it everywhere — suggestion that matches most of your current markup:

- **Full-bleed pages** (home, shop, product): `<main>` has no container; each `<section>` owns `.container` inside it (your home partials already do this — `hero-section` → `.container hero-section-inner`).
- **Single-column reading pages** (post, page, tag, author, error, offline, index): `.container` sits on `<main>` alongside the page class.

Fixes that fall out of this rule: `index.hbs` is currently missing `.container` entirely (add it to `<main>`); `page-shop.hbs` and `post-product.hbs` keep their inner containers (correct for full-bleed); everything else already complies.

The `container X-inner` pairing (`container site-header-inner`, `container hero-section-inner`) is a good pattern — `.container` handles max-width/padding, `-inner` handles the component's own layout. Keep it, and use it any time a section needs flex/grid on the containing row.

---

## 5. Free hooks you already have — lean on them instead of new classes

- **`{{body_class}}`** on `<body>`: Ghost emits `home-template`, `post-template`, `page-template page-{slug}`, `tag-template tag-{slug}`, `author-template author-{slug}`, `paged`, `private`… Per-page overrides should use these instead of new wrapper classes when possible.
- **`{{post_class}}`** on articles: emits `post`, `featured`, `tag-{slug}` per post. Add it where articles render:
  - `post.hbs`: `<article class="{{post_class}}">` (it already includes `post`)
  - `product-card.hbs`: `<article class="product-card {{post_class}}">` → featured products get `.featured` for free
  - `index.hbs` list items: `<article class="post-list-item {{post_class}}">`
- **`html[data-theme]`** for all dark/light theming (already in place).
- **Ghost content cards**: everything inside `{{content}}` arrives with `kg-*` classes (`kg-image-card`, `kg-gallery-card`, `kg-callout-card`, `kg-button-card`…). This is the reason for the single `gh-content` scope — one place to style all koenig cards, likely your existing `assets/css/components/ghost.css`.

---

## 6. Utilities the improved markup expects

Small fixed set — resist growing it:

- `container` — max-width + inline padding (exists)
- `btn`, `btn-primary`, `btn-secondary`, + one low-emphasis variant — exists partially
- `visually-hidden` — used by skip link pattern and the "(coming soon)" span in `HTML-IMPROVEMENTS.md`
- `skip-link` — visually hidden until `:focus`

---

## 7. Block inventory after the renames (styling checklist for later)

One CSS concern per block; a sensible file split for `assets/css/components/` when you get there:

| Family | Blocks |
| --- | --- |
| Chrome | `site-header` (+ `site-logo`, `nav-toggle`, `sound-toggle`, `site-header-account`), `site-footer`, `nav-list` (+ variants), `user-menu` |
| Cards & grids | `card-grid`, `product-card`, `post-list` (+ `post-list-item-*`) |
| Home sections | `hero-section`, `trust-strip`, `featured-product`, `why-it-works` (`benefit-list/-item`), `how-to-use` (`how-to-use-steps`), `social-proof` (`testimonial-list/-item`), `brand-story`, `final-cta`, `home-latest-posts`, `home-our-authors` (`authors-list`) |
| Product page | `product-layout`, `product-image`, `product-info`, `product-title`, `product-excerpt`, `product-price`, `product-cta`, `product-benefits`, `product-usage`, `product-ingredients`, `product-reviews`, `back-to-shop` |
| Pages | `index-page`, `home-page`, `post-page`, `page-default`, `shop-page` (`shop-header`, `shop-description`, `shop-grid`), `tag-page`, `author-page` (`author-cover`, `author-meta`, `author-profile-*`), `offline-page`, `error-page` |
| Content | `gh-content` (all `kg-*` card styling lives here), `post-comments` |
| Overlays | `lor-dialog` (+ `-header`, `-body`, `-message`, `-actions`, `-transient`, `cookie-consent`, `contact-form`), `toast-region`, `toast` (+ `-message`, `-action`, `-close`, type variants) |
| Social | `icon icon-{type}`, `no-social-accounts`, `author-profile-social-link` |
| Utilities | `container`, `btn` family, `visually-hidden`, `skip-link` |

Everything in one table means: when you start CSS, each row is a file, each block is a nesting root, and no selector should ever need to reach across rows.

---

## 8. Order of operations

1. Apply `HTML-IMPROVEMENTS.md` (markup shape changes first — some classes appear/disappear there).
2. Do the rename map (§3) — templates, then `dialog.mjs`. Grep for each old name to confirm zero leftovers, including in `assets/css/` (your existing CSS references the old names).
3. Add `{{post_class}}` hooks and the container fix on `index.hbs` (§4–5).
4. Freeze the convention in `README.md` (§2) so future partials follow it.
5. Then styling is: one file per family (§7), states via attributes, content via `gh-content`.
