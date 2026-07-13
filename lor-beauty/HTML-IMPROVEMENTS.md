# L'OR Beauty — HTML, ARIA & Attribute Improvements

Full code suggestions per file, ready to compare against your current markup. Snippets already include the fixes from `CODE-REVIEW.md` (marked ⚠ where relevant). CSS class names untouched.

---

## 0. Global conventions (used throughout the snippets)

1. **Skip link** as the first thing in `<body>`, with `id="main-content"` + `tabindex="-1"` on every template's `<main>` (tabindex lets the main receive focus when jumped to).
2. **Images:** `loading="lazy" decoding="async"` on everything below the fold; feature images use `{{feature_image_alt}}` with a fallback (`alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"`) — Ghost stores real alt text, use it.
3. **Duplicate links (image + title to same URL):** hide the image link from the accessibility tree — `aria-hidden="true" tabindex="-1"` — so screen readers don't hear every post twice.
4. **Popover invokers:** buttons with `popovertarget` get `aria-expanded` managed *by the browser automatically* — don't add it manually.
5. **No ARIA is better than wrong ARIA:** native `<nav>`, `<dialog>`, `<button>`, lists, and popovers already carry the right semantics; roles are only added where they fix something.
6. **Names of people are not `<cite>`** — the spec reserves `<cite>` for titles of works. Testimonials use the `<figure>`/`<figcaption>` pattern instead.

---

## 1. `default.hbs`

Head cleanups + skip link + color-scheme:

```hbs
<head>
    <meta charset="UTF-8" />
    {{!-- HandheldFriendly / MobileOptimized are 2000s-era, ignored by modern browsers — removed --}}
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {{!-- never restrict zoom; width+initial-scale is all that's needed --}}
    <meta name="color-scheme" content="light dark" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="theme-color" content="#c9a45c" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a2e1f" />
    <meta name="format-detection" content="telephone=no" />
    ...
</head>
<body class="{{body_class}}">
    <a class="skip-link" href="#main-content">{{t "Skip to content"}}</a>
    {{> "header"}}
    {{{body}}}
    {{> "footer"}}
    ...
</body>
```

The skip link needs the usual CSS (visually hidden until focused). Then in **every template**, the `<main>` becomes e.g.:

```hbs
<main id="main-content" tabindex="-1" class="post-page container">
```

Also drop `type="text/javascript"` from the inline theme script (`<script>` is enough).

---

## 2. `partials/header.hbs`

```hbs
<header class="site-header">
    <div class="container site-header-inner">

        <a href="{{@site.url}}" class="site-logo" rel="home">
            {{#if @site.logo}}
                <img src="{{@site.logo}}" alt="{{@site.title}} — {{t "Home"}}" width="120" height="40" />
            {{else}}
                <span class="site-logo-text">{{@site.title}}</span>
            {{/if}}
        </a>

        {{!-- aria-expanded is set automatically by the browser for popovertarget invokers --}}
        <button type="button" class="nav-toggle" popovertarget="primary-nav" aria-label="{{t "Menu"}}">
            <span class="nav-toggle-icon" aria-hidden="true"></span>
        </button>

        <nav id="primary-nav" class="site-nav" popover="auto" aria-label="{{t "Primary"}}">
            {{navigation}}
        </nav>

        {{!-- aria-pressed="true" = sounds ON. Label states the *subject*, the
             pressed state supplies on/off — don't put "toggle" in the label. --}}
        <button type="button" class="sound-toggle" data-sound-toggle aria-pressed="true" aria-label="{{t "Notification sounds"}}">
            <span class="sound-toggle-icon" aria-hidden="true"></span>
        </button>

        <div class="site-header-account">
            {{> "user/profile-dropdown"}}
        </div>
    </div>
</header>
```

Notes: set real `width`/`height` on the logo (prevents layout shift — adjust numbers to your logo box); the JS in `application.mjs` should sync `aria-pressed` from `isMuted()` on load (snippet already in CODE-REVIEW.md §2.2).

---

## 3. `partials/navigation.hbs`

Both branches identical apart from the class, so also worth deduplicating. `role="menu"`/`menuitem` removed (they describe application menus, not link lists, and break screen-reader link navigation):

```hbs
<ul class="nav-list {{#if isSecondary}}nav-list-secondary{{else}}nav-list-primary{{/if}}">
    {{#foreach navigation}}
        <li class="nav-item nav-{{slug}}{{#if current}} nav-current{{/if}}">
            <a href="{{url absolute="true"}}"{{#if current}} aria-current="page"{{/if}}>{{label}}</a>
        </li>
    {{/foreach}}
</ul>
```

`aria-current="page"` you already had — good, keep it.

---

## 4. `partials/footer.hbs`

```hbs
<footer class="site-footer">
    <div class="container site-footer-inner">
        <nav class="site-nav-secondary" aria-label="{{t "Secondary"}}">
            {{navigation type="secondary"}}
        </nav>
        {{!-- buttons aren't navigation — moved out of <nav> --}}
        <button type="button" data-dialog-open="contact-dialog">{{t "Contact"}}</button>
        <button type="button" data-dialog-open="cookie-consent">{{t "Cookie settings"}}</button>
        {{> "social-accounts-site"}}
        <p class="site-footer-copyright">
            <small>&copy; <time datetime="{{date format="YYYY"}}">{{date format="YYYY"}}</time> {{@site.title}}</small>
        </p>
    </div>
    {{> "contact-dialog"}}
</footer>
```

The cookie re-open button lives here now (instead of inline in `home.hbs` main content).

---

## 5. `index.hbs`

```hbs
{{!< default}}
<main id="main-content" tabindex="-1" class="post-index">
    <header class="post-index-header">
        <h1>{{@site.title}}</h1>
        {{#if @site.description}}<p class="post-index-description">{{@site.description}}</p>{{/if}}
    </header>

    <div class="post-list">
        {{#foreach posts}}
            <article class="post-list-item">
                <h2><a href="{{url}}">{{title}}</a></h2>
                {{#if feature_image}}
                    {{!-- duplicate of the title link → hidden from AT and tab order --}}
                    <a href="{{url}}" class="post-list-item-image" aria-hidden="true" tabindex="-1">
                        <img
                            src="{{img_url feature_image size="m"}}"
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                    </a>
                {{/if}}
                {{#if excerpt}}<p class="post-list-item-excerpt">{{excerpt words="30"}}</p>{{/if}}
                <p class="post-list-item-meta">
                    <a href="{{primary_author.url}}">{{primary_author.name}}</a>
                    <time datetime="{{date format="YYYY-MM-DD"}}">{{date format="D MMMM YYYY"}}</time>
                    <span>{{reading_time}}</span>
                </p>
            </article>
        {{else}}
            <p>{{t "No posts"}}</p>
        {{/foreach}}
    </div>

    {{pagination}}
</main>
```

`alt=""` on the image is deliberate: the accessible name for that destination is the adjacent title link; a second "alt = title" makes screen readers announce everything twice.

---

## 6. `home.hbs`

Includes the ⚠ authors fix. `<hgroup>` around a lone `<h2>` adds nothing — removed (hgroup is for heading + `<p>` subtitle pairs):

```hbs
{{!< default}}
<main id="main-content" tabindex="-1" class="home-page">
    {{> "hero-section"}}
    {{> "trust-strip"}}
    {{> "featured-product"}}
    {{> "why-it-works"}}
    {{> "how-to-use"}}
    {{> "social-proof"}}
    {{> "brand-story"}}

    <section class="home-latest-posts" aria-labelledby="home-latest-posts-heading">
        <h2 id="home-latest-posts-heading">{{t "Latest posts"}}</h2>
        {{#get "posts" filter="tag:-product" limit="3" as |latestPosts|}}
        <div class="post-list">
            {{#foreach latestPosts}}
                <article class="post-list-item">
                    <h3><a href="{{url}}">{{title}}</a></h3>
                    {{#if excerpt}}<p class="post-list-item-excerpt">{{excerpt words="24"}}</p>{{/if}}
                </article>
            {{else}}
                <p>{{t "No posts"}}</p>
            {{/foreach}}
        </div>
        {{/get}}
    </section>

    <section class="home-our-authors" aria-labelledby="home-our-authors-heading"> {{!-- ⚠ id fixed --}}
        <h2 id="home-our-authors-heading">{{t "Our authors"}}</h2>
        {{#get "authors" limit="all"}} {{!-- ⚠ was {{#foreach authors}} on nothing --}}
        <ul class="authors-list">
            {{#foreach authors}}
                <li> {{!-- ⚠ li now closed inside the loop --}}
                    <h3>{{name}}</h3>
                    {{> "social-accounts-this"}}
                </li>
            {{/foreach}}
        </ul>
        {{/get}}
    </section>

    {{> "final-cta"}}
    {{> "cookie-consent"}} {{!-- better: move to default.hbs so consent shows on all landing pages --}}
</main>
```

(Drop the `console.log` contentFor block before release.)

---

## 7. `post.hbs`

Adds a proper article header with date/author metadata and real alt text:

```hbs
{{!< default}}
<main id="main-content" tabindex="-1" class="post-page container">
    {{#post}}<article class="post">
        <header class="post-header">
            <h1>{{title}}</h1>
            <p class="post-meta">
                <a href="{{primary_author.url}}" rel="author">{{primary_author.name}}</a>
                <time datetime="{{date format="YYYY-MM-DD"}}">{{date format="D MMMM YYYY"}}</time>
                <span>{{reading_time}}</span>
            </p>
        </header>
        {{#if feature_image}}
            <figure class="post-feature-image">
                <img
                    srcset="{{img_url feature_image size="s"}} 300w,
                            {{img_url feature_image size="m"}} 600w,
                            {{img_url feature_image size="l"}} 1200w"
                    sizes="(max-width: 700px) 100vw, 700px"
                    src="{{img_url feature_image size="l"}}"
                    alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"
                    decoding="async"
                />
                {{#if feature_image_caption}}
                    <figcaption>{{feature_image_caption}}</figcaption>
                {{/if}}
            </figure>
        {{/if}}
        <div class="post-content">
            {{content}}
        </div>
        {{#if comments}}<section class="post-comments" aria-label="{{t "Comments"}}">
            {{comments}}
        </section>{{/if}}
    </article>{{/post}}
</main>
```

No `loading="lazy"` on the feature image — it's above the fold; lazy-loading it hurts LCP.

---

## 8. `page.hbs`, `page-offline.hbs`, `error-404.hbs`

`page.hbs` — just the main id/tabindex:

```hbs
{{!< default}}
<main id="main-content" tabindex="-1" class="page container">
    {{#post}}<article>
        {{#match @page.show_title_and_feature_image}}<h1>{{title}}</h1>{{/match}}
        <div class="page-content">{{content}}</div>
    </article>{{/post}}
</main>
```

`page-offline.hbs` — the h1 should say what happened (site name is already in the header); the button loses the inline `onclick` (CSP-hostile) in favor of a data hook:

```hbs
{{!< default}}
<main id="main-content" tabindex="-1" class="offline-page container">
    <h1>{{t "You're Currently Offline"}}</h1>
    <p class="offline-page-message">{{t "It looks like you've lost your internet connection. Please check your network settings and try again."}}</p>
    <button type="button" class="btn btn-primary" data-reload>{{t "Try Again"}}</button>
</main>
{{#contentFor "scripts"}}
<script type="module">
    document.querySelector("[data-reload]")?.addEventListener("click", () => window.location.reload());
</script>
{{/contentFor}}
```

`error-404.hbs` — translated + a way forward:

```hbs
{{!< default}}
<main id="main-content" tabindex="-1" class="error-page container">
    <h1>{{t "Page Not Found"}}</h1>
    <p>{{t "Sorry, we couldn't find what you're looking for."}}</p>
    <a href="{{@site.url}}/" class="btn btn-primary">{{t "Back to Home"}}</a>
</main>
```

---

## 9. `page-shop.hbs`

Includes the ⚠ scope fix; HTML comments swapped for Handlebars comments (they don't ship to the client); the grid gets an accessible name:

```hbs
{{!< default}}
<main id="main-content" tabindex="-1" class="shop-page">
    <div class="container">
        {{#page}}
        <header class="shop-header">
            <h1>{{title}}</h1>
            {{#if excerpt}}<p class="shop-description">{{excerpt}}</p>{{/if}}
        </header>
        {{/page}}

        <section class="shop-grid" aria-label="{{t "Products"}}">
            {{#get "posts" filter="tag:product" limit="99" include="tags"}}
                {{#if posts}}
                    <ul class="product-grid" role="list">
                        {{#foreach posts}}<li>{{> "product-card"}}</li>{{/foreach}}
                    </ul>
                {{else}}
                    <p>{{t "No products available at the moment."}}</p>
                {{/if}}
            {{/get}}
        </section>
    </div>
</main>
```

A `<ul>` gives screen readers an item count for free ("list, 4 items"). The explicit `role="list"` guards against CSS `list-style: none` stripping list semantics in Safari/VoiceOver.

---

## 10. `partials/product-card.hbs`

Heading dropped to `h3` (cards render under `h2` section headings on home and under the shop's `h1`), generic "View Product" link gets a per-product accessible name, and the image duplicate-link pattern applied:

```hbs
<article class="product-card">
    <a href="{{url}}" class="product-card-image" aria-hidden="true" tabindex="-1">
        {{#if feature_image}}
            <img
                src="{{img_url feature_image size="m"}}"
                alt=""
                loading="lazy"
                decoding="async"
            />
        {{else}}
            <div class="product-card-placeholder"></div>
        {{/if}}
    </a>

    <div class="product-card-content">
        <h3 class="product-card-title"><a href="{{url}}">{{title}}</a></h3>
        {{#if excerpt}}<p class="product-card-excerpt">{{excerpt}}</p>{{/if}}
        <p class="product-card-price">150₪</p> {{!-- p, not div: it's content, and screen readers pause properly --}}
        <a href="{{url}}" class="btn btn-primary" aria-label="{{t "View product"}}: {{title}}">{{t "View Product"}}</a>
    </div>
</article>
```

---

## 11. `post-product.hbs`

Key changes: buy button is a real (disabled) button until commerce exists — a `href="#"` link that goes nowhere is a trap for keyboard and screen-reader users; testimonials use figure/figcaption; sections get `aria-labelledby`; typo fixed:

```hbs
{{!< default}}
<main id="main-content" tabindex="-1" class="product-page">
    <div class="container">
        {{#post}}
        <article class="product">
        <section class="product-header" aria-labelledby="product-title">
            <div class="product-grid">
                <div class="product-image">
                    {{#if feature_image}}
                        <img
                            src="{{img_url feature_image size="l"}}"
                            alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"
                            decoding="async"
                        />
                    {{/if}}
                </div>
                <div class="product-info">
                    <h1 id="product-title" class="product-title">{{title}}</h1>
                    {{#if excerpt}}<p class="product-excerpt">{{excerpt}}</p>{{/if}}
                    <p class="product-price"><data value="150">150₪</data></p>
                    <div class="product-cta">
                        <button type="button" class="btn btn-primary" disabled>{{t "Buy Now"}} <span class="visually-hidden">({{t "coming soon"}})</span></button>
                    </div>
                    <ul class="product-benefits">
                        <li>Brightens dark circles</li>
                        <li>Restores natural glow</li>
                        <li>Helps reduce acne marks</li>
                        <li>Improves skin texture</li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="product-content">
            <div class="content-wrapper">{{content}}</div>
        </section>

        <section class="product-usage" aria-labelledby="product-usage-heading">
            <h2 id="product-usage-heading">{{t "How to Use"}}</h2>
            <p>Apply 2&ndash;3 drops at night on clean skin. Gently tap until fully absorbed.</p> {{!-- ⚠ typo + en dash --}}
        </section>

        <section class="product-ingredients" aria-labelledby="product-ingredients-heading">
            <h2 id="product-ingredients-heading">{{t "Ingredients"}}</h2>
            <p>100% Pure Prickly Pear Seed Oil</p>
        </section>

        <section class="product-reviews" aria-labelledby="product-reviews-heading">
            <h2 id="product-reviews-heading">{{t "Customer Reviews"}}</h2>
            <figure class="review">
                <blockquote><p>My skin feels brighter and smoother within days.</p></blockquote>
                <figcaption>&mdash; {{t "Verified Customer"}}</figcaption>
            </figure>
            <figure class="review">
                <blockquote><p>Lightweight and very effective.</p></blockquote>
                <figcaption>&mdash; {{t "Verified Customer"}}</figcaption>
            </figure>
        </section>

        {{#if comments}}<section class="post-comments" aria-label="{{t "Comments"}}">
            {{comments}}
        </section>{{/if}}

        <div class="back-to-shop">
            <a href="{{@site.url}}/shop/">&larr; {{t "Back to Shop"}}</a>
        </div>
        </article>
        {{/post}}
    </div>
</main>
```

---

## 12. `author.hbs`

Fixes from CODE-REVIEW plus alt/labels; redundant `{{#is "author"}}` removed:

```hbs
{{!< default}}
{{#author}}<main id="main-content" tabindex="-1" class="author-page container">
    {{#if cover_image}}<div class="post-card-image-link">
        <img class="post-card-image"
            srcset="{{img_url cover_image size="s"}} 300w,
                    {{img_url cover_image size="m"}} 600w,
                    {{img_url cover_image size="l"}} 1200w,
                    {{img_url cover_image size="xl"}} 2000w"
            sizes="(max-width: 1000px) 400px, 800px"
            src="{{img_url cover_image size="m"}}"
            alt="" {{!-- decorative banner; the h1 below names the page --}}
            decoding="async"
        />
    </div>{{/if}}
    {{#if profile_image}}<figure>
        <img src="{{img_url profile_image size="s"}}" alt="{{name}}" width="100" height="100" loading="lazy" decoding="async" />
    </figure>{{/if}}
    <header>
        <h1>{{name}}</h1>
        {{#if bio}}<p>{{bio}}</p>{{/if}}
        {{#if threads}}<a href="{{social_url type="threads"}}" target="_blank" rel="noopener">{{t "Follow me on Threads"}}</a>{{/if}}
    </header>
    <p class="author-meta">
        {{plural pagination.total empty=(t "No posts") singular=(t "1 post") plural=(t "% posts")}}
    </p>
    ...
    <footer class="author-profile-footer">
        {{#if location}}<p class="author-profile-location">{{location}}</p>{{/if}}
        <div class="author-profile-meta">
            {{#if website}}
                <a class="author-profile-social-link" href="{{website}}" target="_blank" rel="noopener">{{website}}</a>
            {{/if}}
            ...
        </div>
        {{> "social-accounts-author"}}
    </footer>
</main>{{/author}}
```

(`{{pagination}}` and the post list stay outside `{{#author}}` as you have them — just remember the ⚠ `brands/*` partials must exist before the twitter/facebook links render.)

---

## 13. Home-page section partials

**`hero-section.hbs`** — already good. One addition: if the cover image is meaningful rather than decorative you'd want a real `<img>`; as a CSS background it's invisible to AT, which is fine for ambiance. No change needed.

**`trust-strip.hbs`** — good (`aria-label` on section, list markup). Add `{{t}}` to the items when you localize.

**`why-it-works.hbs` / `how-to-use.hbs`** — structurally good. Only note: `<h3>` inside `benefit-item` is correct under the section's `<h2>`. Add `{{t}}` when localizing.

**`social-proof.hbs`** — same `<cite>` issue as the product page:

```hbs
<section class="social-proof" aria-labelledby="social-proof-heading">
    <div class="container">
        <h2 id="social-proof-heading">{{t "Customer Reviews"}}</h2>
        <ul class="testimonial-list" role="list">
            <li class="testimonial-item">
                <figure>
                    <blockquote><p>My skin feels brighter and smoother within days.</p></blockquote>
                    <figcaption>&mdash; {{t "Verified Customer"}}</figcaption>
                </figure>
            </li>
            <li class="testimonial-item">
                <figure>
                    <blockquote><p>Lightweight and very effective.</p></blockquote>
                    <figcaption>&mdash; {{t "Verified Customer"}}</figcaption>
                </figure>
            </li>
        </ul>
    </div>
</section>
```

**`featured-product.hbs`, `brand-story.hbs`, `final-cta.hbs`** — structure is right (labelled sections). Only the ⚠ `{{@site.url}}/shop/` slash fix in `final-cta.hbs`.

---

## 14. Dialogs

### `partials/contact-dialog.hbs`

Adds `autocomplete` (mobile keyboards + password managers), explicit input hints, and the ⚠ contentFor fix:

```hbs
<dialog id="contact-dialog" class="lor-dialog" aria-labelledby="contact-dialog-title">
    <header class="lor-dialog-header">
        <h2 id="contact-dialog-title">{{t "Contact us"}}</h2>
        <button type="button" data-dialog-close aria-label="{{t "Close"}}"><span aria-hidden="true">&cross;</span></button>
    </header>
    <section class="lor-dialog-body">
        <form id="contact-form" class="contact-form">
            <label>{{t "Name"}}
                <input name="name" type="text" required autocomplete="name" />
            </label>
            <label>{{t "Email"}}
                <input name="email" type="email" required autocomplete="email" spellcheck="false" />
            </label>
            <label>{{t "Message"}}
                <textarea name="message" rows="5" required></textarea>
            </label>
            <div class="lor-dialog-actions">
                <button type="button" data-dialog-close>{{t "Cancel"}}</button>
                <button type="submit" class="btn btn-primary">{{t "Send"}}</button>
            </div>
        </form>
    </section>
</dialog>
{{#contentFor "scripts"}} {{!-- ⚠ opener was missing --}}
<script type="module">
    import { initContactForm } from "contact";
    initContactForm();
</script>
{{/contentFor}}
```

Dropped the `title` attributes on buttons — `title` is unreliable for AT and redundant when the button has visible text. The ✗ close glyph is wrapped in `aria-hidden` so only the `aria-label` is announced.

### `partials/cookie-consent.hbs`

`autofocus` steers initial focus to the safest choice; the re-open button moves to the footer (see §4):

```hbs
<dialog id="cookie-consent" class="lor-dialog" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-desc">
    <h2 id="cookie-consent-title">{{t "We value your privacy"}}</h2>
    <p id="cookie-consent-desc">We use cookies and similar technologies to improve your experience, marketing, analyze traffic, and (if you allow) personalize content. Learn more in our <a href="/cookie-policy/">{{t "Cookie policy"}}</a>.</p>
    <menu class="cookie-consent-actions">
        <li><button type="button" data-cookie-action="manage">{{t "Manage preferences"}}</button></li>
        <li><button type="button" data-cookie-action="decline" autofocus>{{t "Reject all"}}</button></li>
        <li><button type="button" data-cookie-action="accept">{{t "Accept all"}}</button></li>
    </menu>
</dialog>
{{#contentFor "scripts"}}
<script type="module">
    import { initCookieConsent } from "cookies";
    initCookieConsent();
</script>
{{/contentFor}}
```

`<menu>`'s children must be `<li>` — bare buttons inside `<menu>` are invalid HTML. Removed `target="_top"` (meaningless outside frames) and the `title` attribute. Reminder from CODE-REVIEW: the manage button in `cookies.mjs` navigates to `/privacy/` while this links `/cookie-policy/` — align them.

### `partials/dialog.hbs` (generic)

Already well-formed. Two tweaks: wrap the × so the `aria-label` is the only announced name, and don't render an empty `<footer>` when no action labels are passed:

```hbs
<button type="button" data-dialog-close aria-label="{{t "Close"}}"><span aria-hidden="true">&times;</span></button>
```

```hbs
{{#if confirmLabel}}
<footer class="lor-dialog-actions">
    {{#if cancelLabel}}<button type="button" data-dialog-close>{{cancelLabel}}</button>{{/if}}
    <button type="button" class="dialog-confirm" data-dialog-confirm
        {{#if confirmValue}}data-dialog-confirm-value="{{confirmValue}}"{{/if}}>
        {{confirmLabel}}
    </button>
</footer>
{{/if}}
```

### `partials/user/profile-dropdown.hbs`

```hbs
{{#if @member}}
    <button type="button" popovertarget="user-menu" class="user-menu-toggle">
        {{t "Account"}}
    </button>
    <nav id="user-menu" popover class="user-menu" aria-label="{{t "Account"}}">
        <a href="#/portal/account">{{t "My Account"}}</a>
        <a href="#" data-members-signout>{{t "Log Out"}}</a> {{!-- ⚠ was javascript: --}}
    </nav>
{{else}}
    <a href="#/portal/signin" class="btn btn-secondary">{{t "Sign In"}}</a>
{{/if}}
```

`aria-label` dropped from the toggle (its visible text already names it — redundant ARIA); the menu is a `<nav>` so it's discoverable as a landmark.

---

## 15. `partials/social-accounts-*.hbs` (all three)

Links open new tabs — say so; and prevent the URL being read out when a `name` is missing:

```hbs
{{#social_accounts @site}}<a href="{{href}}" target="_blank" rel="noopener" aria-label="{{t (name)}} ({{t "opens in new tab"}})">
    {{#> (concat "icons/" type)}}
    <span class="icon icon-web" aria-hidden="true">{{t (name)}}</span>
    {{/undefined}}
</a>{{else}}<p class="no-social-accounts">{{t "No social accounts connected yet."}}</p>{{/social_accounts}}
```

The link's `aria-label` is the single accessible name, so the inner content — text fallback today, SVG icons later — is marked `aria-hidden="true"` to prevent double announcement. When you create the `icons/*` partials, give each SVG `aria-hidden="true" focusable="false"` for the same reason.

---

## 16. JS-generated markup (`toast.mjs`, `dialog.mjs`)

**`toast.mjs`:**

- The region is `role="status"` + `aria-live="polite"`, and each toast *also* gets `role="alert"` — that's two competing live-region semantics and can announce twice. Keep the region as the single live region and drop `toast.setAttribute("role", "alert")`. If you want errors to interrupt, create a second region with `aria-live="assertive"` for `type === "error"` only.
- The close button has an `aria-label` but empty content — give it a glyph for sighted users:

```js
const closeButton = document.createElement("button");
closeButton.type = "button";
closeButton.className = "toast-close";
closeButton.setAttribute("aria-label", "Dismiss");
const glyph = document.createElement("span");
glyph.setAttribute("aria-hidden", "true");
glyph.textContent = "×"; // ×
closeButton.appendChild(glyph);
```

**`dialog.mjs` (`buildTransientDialog`)**: give the message an id and reference it, so the dialog has an accessible name when it opens:

```js
const text = document.createElement("p");
text.className = "transient-dialog-message";
text.id = `${dialog.id}-message`;
text.textContent = message;
dialog.setAttribute("aria-labelledby", text.id);
```

---

## 17. Locale keys to add (from the `{{t}}` calls above)

New keys used in these snippets: "Skip to content", "Home", "Notification sounds", "Contact", "Cookie settings", "Comments", "Products", "View product", "Buy Now", "coming soon", "How to Use", "Ingredients", "Customer Reviews", "Verified Customer", "Back to Shop", "Contact us", "Name", "Email", "Message", "Cancel", "Send", "Close", "We value your privacy", "Cookie policy", "Manage preferences", "Reject all", "Accept all", "Follow me on Threads", "opens in new tab", "Page Not Found", "Sorry, we couldn't find what you're looking for.", "Back to Home" — plus the gaps already listed in CODE-REVIEW.md §3.8.

---

## Quick checklist

- [ ] Skip link + `id="main-content" tabindex="-1"` on every `<main>`
- [ ] Remove `role="menu"`/`menuitem` from navigation
- [ ] `aria-hidden="true" tabindex="-1"` + `alt=""` on duplicate image links
- [ ] `{{feature_image_alt}}` fallback pattern on all feature images
- [ ] `loading="lazy" decoding="async"` below the fold; never on the LCP image
- [ ] `<li>` children inside `<menu>` (cookie consent)
- [ ] figure/figcaption instead of `<cite>` for testimonial attributions
- [ ] `autocomplete` on contact form fields
- [ ] Kill `href="javascript:"`, inline `onclick`, `title=` tooltips
- [ ] Product card heading → `h3`; "View Product" gets per-product `aria-label`
- [ ] Toast: one live region, no per-toast `role="alert"`; visible × glyph
- [ ] Transient dialogs get `aria-labelledby`
