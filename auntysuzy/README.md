# Aunty Suzy

A theme for sole traders.

- **Live site:** [auntysuzy.co.uk](https://auntysuzy.co.uk/)
- **Version:** 0.1.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, with no front-end frameworks
- Responsive, mobile-first layout
- Installable PWA, with a web app manifest, a service worker and an offline page
- Translations: English, Spanish
- Ghost members, sign-up and account pages
- Shop powered by [Snipcart](https://snipcart.com/)

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w auntysuzy
npm restart -w auntysuzy
```

Then activate **auntysuzy** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `auntysuzy/`, or from the repo root with `-w auntysuzy` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `auntysuzy.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Custom templates

- `page-about.hbs`
- `page-blog.hbs`
- `page-cookie-policy.hbs`
- `page-privacy-policy.hbs`
- `page-returns-policy.hbs`
- `page-support.hbs`
- `page-terms-conditions.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2022-2026 Salaheddin AbuEin
