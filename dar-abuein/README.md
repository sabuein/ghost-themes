# Dar AbuEin

A Ghost theme for abuein.com, with RTL support.

- **Live site:** [abuein.com](https://abuein.com/)
- **Version:** 1.0.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## About

The site is called ***Dar AbuEin***. *Dar* can mean a publishing house, and that is the aim of this project: to help publish content, elegantly and together, with modern web technologies and proper support for right-to-left languages.

*AbuEin* is my family name, which means the *father* of the *eye*. It is a tribute to my family, and a way to show myself, and what's inside me, to you and to the world, insha'Allah.

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
npm run link -w dar-abuein
npm restart -w dar-abuein
```

Then activate **dar-abuein** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `dar-abuein/`, or from the repo root with `-w dar-abuein` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `dar-abuein.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Custom templates

- `custom-gallery.hbs`
- `custom-video.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2022-2026 Salaheddin AbuEin
