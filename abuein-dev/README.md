# AbuEin.dev

A Ghost theme for abuein.dev, with RTL support.

- **Live site:** [abuein.dev](https://abuein.dev/)
- **Version:** 0.1.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## About

The theme for [abuein.dev](https://abuein.dev/), my own site, with support for right-to-left languages, mainly Arabic.

## Portal links

Add these data attributes to any element to open a Ghost Portal screen.

| Screen | Attribute |
| --- | --- |
| Default | `data-portal` |
| Sign in | `data-portal="signin"` |
| Sign up | `data-portal="signup"` |
| Account | `data-portal="account"` |
| Account / Plans | `data-portal="account/plans"` |
| Account / Profile | `data-portal="account/profile"` |
| Account / Newsletters | `data-portal="account/newsletters"` |
| Account / Newsletter help | `data-portal="account/newsletters/help"` |

See also the [PWA checklist](https://web.dev/articles/pwa-checklist).

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, with no front-end frameworks
- Responsive, mobile-first layout
- Installable PWA, with a web app manifest, a service worker and an offline page
- Translations: Arabic (right-to-left), English, Spanish
- Ghost members, sign-up and account pages

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w abuein-dev
npm restart -w abuein-dev
```

Then activate **abuein-dev** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `abuein-dev/`, or from the repo root with `-w abuein-dev` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `abuein-dev.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Custom templates

- `custom-gallery.hbs`
- `custom-video.hbs`
- `page-about.hbs`
- `page-ai.hbs`
- `page-careers.hbs`
- `page-contact.hbs`
- `page-faq.hbs`
- `page-offline.hbs`
- `page-portfolio.hbs`
- `page-pwa.hbs`
- `page-services.hbs`
- `page-testing.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2022-2026 Salaheddin AbuEin
