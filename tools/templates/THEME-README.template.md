# {{Theme Title}}

{{One-sentence description — same as "description" in package.json.}}

- **Live site:** {{https://example.com/}}
- **Version:** {{1.0.0}} · **Ghost:** `{{>=6.67.0}}` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

![Desktop screenshot]({{assets/screenshot-desktop.jpg}})

## Features

- Plain HTML5, CSS3 and ES6+ JavaScript, no frameworks
- Responsive, mobile-first layout
- Accessible: semantic HTML, skip link, visible focus, `prefers-reduced-motion`
- PWA: web app manifest, service worker and offline page
- {{RTL / Arabic support, shop, members, custom settings…}}

## Getting started

From the repo root (see the [main README](../README.md) for one-off setup):

```bash
npm install
npm run link -w {{theme}}
npm restart -w {{theme}}
```

Then activate **{{theme}}** in Ghost Admin under **Settings → Design & branding**.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` / `stop` / `restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` |
| `npm run link` / `unlink` | Link this theme into Ghost |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `{{theme}}.zip`, ready to upload |
| `npm run scan:zip` | Zip and validate the zip |

Add `-w {{theme}}` when running from the repo root.
<!-- If the theme has a build step, add: | `npm run build` | {{what it builds}} | -->

## Theme settings

<!-- Remove this section if package.json → config.custom is empty. -->

| Setting | Type | Default | Purpose |
| --- | --- | --- | --- |
| `{{accent_color}}` | {{color}} | `{{#000000}}` | {{…}} |

## Structure

```text
{{theme}}/
├── default.hbs        # base layout
├── index.hbs          # post list
├── post.hbs / page.hbs
├── partials/
├── assets/{css,js,images}
└── package.json
```

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**.
{{Built for Client Name — https://example.com/}}

## Licence

[MIT](LICENSE) © {{first year}}–2026 Salaheddin AbuEin
