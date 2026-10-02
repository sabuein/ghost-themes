# z23

A Ghost Handlebars theme for art galleries.

- **Live site:** [zawyeh.dev](https://zawyeh.dev/)
- **Version:** 0.1.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## Resources

- [Ghost Admin API](https://ghost.org/docs/admin-api/)

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, with no front-end frameworks
- Responsive, mobile-first layout
- Translations: Arabic (right-to-left), English

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w z23
npm restart -w z23
```

Then activate **z23** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `z23/`, or from the repo root with `-w z23` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `z23.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Custom templates

- `custom-exhibition.hbs`
- `page-artists.hbs`
- `page-everything.hbs`
- `page-press.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2023-2026 Salaheddin AbuEin
