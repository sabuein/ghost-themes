# Starter Kit

A starter kit for building new Ghost themes.

- **Live site:** not deployed
- **Version:** 1.0.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## Using it as a starting point

1. Copy `starter-kit/` to a new folder named after your theme.
2. Update `name`, `description`, `version`, `demo` and `screenshots` in its `package.json`.
3. Add the folder to `workspaces` in the root `package.json`, then run `npm install` at the root.
4. Replace this README using [`tools/templates/THEME-README.template.md`](../tools/templates/THEME-README.template.md).

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, with no front-end frameworks
- Responsive, mobile-first layout
- Installable PWA, with a web app manifest, a service worker and an offline page
- Translations: English, Spanish

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w starter-kit
npm restart -w starter-kit
```

Then activate **starter-kit** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `starter-kit/`, or from the repo root with `-w starter-kit` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `starter-kit.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Custom templates

- `custom-offline.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2024-2026 Salaheddin AbuEin
