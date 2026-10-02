# Swifton Databases

A custom Ghost theme for Swifton Databases Limited.

- **Live site:** [swifton.co.uk](https://swifton.co.uk/)
- **Version:** 1.0.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

## Design

- **Look and feel:** a clean blue palette that conveys trust and professionalism, with a consistent, responsive layout on every page.
- **Home:** hero with a clear value proposition, services overview with icons, an industry sectors grid and a call to action.
- **About:** company history, a milestones timeline and key team members.
- **Case studies:** challenge, solution and results, with industry tags.
- **Solutions:** detail on each service, a process timeline and clear calls to action.
- **Contact:** enquiry form, contact details, office hours and social links.

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, with no front-end frameworks
- Responsive, mobile-first layout

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w swifton-databases
npm restart -w swifton-databases
```

Then activate **swifton-databases** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `swifton-databases/`, or from the repo root with `-w swifton-databases` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `swifton-databases.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Custom templates

- `custom-solutions.hbs`
- `page-about.hbs`
- `page-case-studies.hbs`
- `page-contact.hbs`
- `page-industries.hbs`
- `page-solutions.hbs`
- `page-team.hbs`

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2024-2026 Salaheddin AbuEin
