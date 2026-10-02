# L’OR Beauty

This project is a custom Ghost CMS theme for L'OR Beauty, a premium skincare brand.

- **Live site:** [lor.beauty](https://lor.beauty/)
- **Version:** 1.0.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## About

A custom theme for L’OR Beauty, a premium skincare brand: a clean, product-focused, production-ready PWA, optimised for fast performance and Meta Pixel conversions.

### Pages

Home · Shop (listing) · Product (reusable template) · About · Contact · FAQ

### Roadmap

- Multi-product support
- Blog integration
- Reviews
- Multi-language (English/Arabic)

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, with no front-end frameworks
- Responsive, mobile-first layout
- Installable PWA, with a web app manifest, a service worker and an offline page
- Translations: Arabic (right-to-left), English
- Custom theme settings in Ghost Admin

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w lor-beauty
npm restart -w lor-beauty
```

Then activate **lor-beauty** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `lor-beauty/`, or from the repo root with `-w lor-beauty` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `lor-beauty.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |
| `npm run pwa:check` | Check the web app manifest and service worker |

## Theme settings

Edit these in Ghost Admin under **Settings → Design & branding → Customise**.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `default_price` | text | `200` |  |

## Custom templates

- `page-offline.hbs`
- `page-shop.hbs`
- `post-product.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2026 Salaheddin AbuEin
