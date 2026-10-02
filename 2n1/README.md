# 2N1

A Ghost theme for a UK-based holding company.

- **Live site:** [2n1.co.uk](https://2n1.co.uk/)
- **Version:** 1.0.1 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, with no front-end frameworks
- Responsive, mobile-first layout
- Installable PWA, with a web app manifest, a service worker and an offline page
- Translations: English, Spanish

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w 2n1
npm restart -w 2n1
```

Then activate **2n1** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `2n1/`, or from the repo root with `-w 2n1` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `2n1.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Custom templates

- `custom-offline.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2025-2026 Salaheddin AbuEin
