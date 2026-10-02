# Bdde Zawake

A Ghost theme for Zawake project, an e-commerce venture between a brother (myself) and his sister (Hanan).

- **Live site:** [zawake.com](https://zawake.com/)
- **Version:** 1.0.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## About

*Bdde Zawake* means “I want sweets”. This is the theme for [Zawake](https://zawake.com/), an e-commerce venture between my sister Hanan and me, selling sweets from the kitchen straight to your door.

## Resources

- [gscan](https://gscan.ghost.org/): the official online tool for testing Ghost themes
- [google-webfonts-helper](https://gwfh.mranftl.com/fonts): self-host Google Fonts
- [Icons8](https://icons8.com/): icons, illustrations and photos

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, with no front-end frameworks
- Responsive, mobile-first layout
- Translations: Arabic (right-to-left), English, Spanish
- Shop powered by [Snipcart](https://snipcart.com/)

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w bdde-zawake
npm restart -w bdde-zawake
```

Then activate **bdde-zawake** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `bdde-zawake/`, or from the repo root with `-w bdde-zawake` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `bdde-zawake.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Custom templates

- `custom-thawra.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2024-2026 Salaheddin AbuEin
