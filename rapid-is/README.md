# Rapid Information Systems

A custom Ghost theme for Rapid Information Systems.

- **Live site:** [rapid-is.co.uk](https://www.rapid-is.co.uk/)
- **Version:** 1.0.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## Server configuration

`server/` holds the live site's Ghost `routes.yaml` and `redirects.yaml`, plus the nginx and SSL site configuration (paths only, no keys). It is kept for reference and is never included in the theme zip. Neither is `assets/backups/`.

## Resources

- [Ghost mail configuration](https://ghost.org/docs/config/#mail)
- [Delivering emails to your audience](https://ghost.org/help/delivering-emails/)
- [Email deliverability for publishers](https://ghost.org/resources/email-deliverability-for-publishers/)
- [Ghost-CLI](https://ghost.org/docs/ghost-cli/)

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, with no front-end frameworks
- Responsive, mobile-first layout

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w rapid-is
npm restart -w rapid-is
```

Then activate **rapid-is** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `rapid-is/`, or from the repo root with `-w rapid-is` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `rapid-is.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Custom templates

- `custom-solutions.hbs`
- `page-about.hbs`
- `page-contact.hbs`
- `page-team.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2024-2026 Salaheddin AbuEin
