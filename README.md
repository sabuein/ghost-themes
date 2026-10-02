# Ghost Themes

Custom themes for [Ghost](https://ghost.org/?via=sabuein), designed and built by
**[Salaheddin AbuEin](https://abuein.dev/)**.

Every theme is plain HTML5, CSS3 and ES6+ JavaScript with Handlebars templates.
There are no front-end frameworks. They aim to be simple, responsive and
accessible, and most are installable as progressive web apps (PWAs).

> These are my independent projects, built outside my full-time role.
> For freelance enquiries, visit [abuein.dev](https://abuein.dev/).

## Themes

| Theme | Description | Live site | Version |
| --- | --- | --- | --- |
| [247lep](247lep/) | Plumbing and heating services | [247lep.co.uk](https://247lep.co.uk/) | 1.1.0 |
| [2n1](2n1/) | UK-based holding company | [2n1.co.uk](https://2n1.co.uk/) | 1.0.1 |
| [abuein-dev](abuein-dev/) | Personal site with RTL support | [abuein.dev](https://abuein.dev/) | 0.1.0 |
| [auntysuzy](auntysuzy/) | Sole traders, with a Snipcart shop | [auntysuzy.co.uk](https://auntysuzy.co.uk/) | 0.1.0 |
| [bdde-zawake](bdde-zawake/) | Arabic/RTL e-commerce for Zawake | [zawake.com](https://zawake.com/) | 1.0.0 |
| [dar-abuein](dar-abuein/) | Publishing with RTL (Arabic) support | [abuein.com](https://abuein.com/) | 1.0.0 |
| [elite-drivers-hertfordshire](elite-drivers-hertfordshire/) | Airport transfers and ground transport | [servex.business](https://servex.business/) | 0.5.0 |
| [grace-gs](grace-gs/) | Grace Governance Solutions | [gracegs.com](https://gracegs.com/) | 1.0.0 |
| [greenrock](greenrock/) | "Under construction" PWA | [greenrockps.com](https://greenrockps.com/) | 1.0.0 |
| [lor-beauty](lor-beauty/) | Premium skincare brand | [lor.beauty](https://lor.beauty/) | 1.0.0 |
| [palestine-riders](palestine-riders/) | Exploring Occupied Palestine on two wheels | [palestineriders.com](https://palestineriders.com/) | 1.0.0 |
| [rapid-is](rapid-is/) | Rapid Information Systems | [rapid-is.co.uk](https://www.rapid-is.co.uk/) | 1.0.0 |
| [starter-kit](starter-kit/) | Boilerplate for new themes | — | 1.0.0 |
| [swifton-databases](swifton-databases/) | Swifton Databases Limited | [swifton.co.uk](https://swifton.co.uk/) | 1.0.0 |
| [tufan](tufan/) | Indie publishing and community media PWA | [tufan.uk](https://tufan.uk/) | 1.0.0 |
| [z23](z23/) | Art galleries | [zawyeh.dev](https://zawyeh.dev/) | 0.1.0 |

Versions below `1.0.0` are still in development.

## Requirements

- [Node.js](https://nodejs.org/) 22.17+ or 24 (see `.nvmrc`)
- [Ghost-CLI](https://ghost.org/docs/ghost-cli/) — `npm install -g ghost-cli@latest`
- A local Ghost install — `ghost install local`

The same commands work on Ubuntu and Windows (cmd, PowerShell or Git Bash).

## Getting started

```bash
git clone https://github.com/sabuein/ghost-themes.git
cd ghost-themes
npm install
```

`npm install` runs once at the repo root. The repo uses
[npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces), so every
theme shares one `node_modules`.

Next, tell the tooling where your local Ghost lives. Copy
`ghost.local.example.json` to `ghost.local.json` and edit it. Git ignores this
file, so each machine keeps its own paths:

```json
{
    "ghostDir": "~/my/instances/ghost-25",
    "zipDir": "~/Desktop",
    "themes": {
        "elite-drivers-hertfordshire": { "ghostDir": "~/my/instances/ghost-servex" }
    }
}
```

On Windows, use forward slashes, for example `"C:/Users/you/my/ghost-cms"`.
The `GHOST_DIR` and `THEME_ZIP_DIR` environment variables override the file.

## Commands

Every theme has the same scripts. Run them from the repo root with `-w <theme>`,
or from inside the theme folder without it.

| Command | What it does |
| --- | --- |
| `npm run link -w 2n1` | Link the theme into your Ghost `content/themes` (a junction on Windows, so no admin rights are needed) |
| `npm run unlink -w 2n1` | Remove that link |
| `npm start -w 2n1` | `ghost start` |
| `npm stop -w 2n1` | `ghost stop` |
| `npm restart -w 2n1` | `ghost restart` |
| `npm run debug -w 2n1` | `ghost run -D` (foreground, development mode) |
| `npm run log -w 2n1` | `ghost log` |
| `npm run update -w 2n1` | `ghost update` |
| `npm run scan -w 2n1` | Validate the theme folder with [gscan](https://github.com/TryGhost/gscan) |
| `npm run zip -w 2n1` | Build (if the theme has a build step) and write `<zipDir>/2n1.zip` |
| `npm run scan:zip -w 2n1` | Zip, then validate the zip exactly as Ghost will receive it |
| `npm test -w 2n1` | Same as `scan` |

Root-level shortcuts run across every theme: `npm run scan`, `npm run build`,
`npm run zip`.

All of this runs through one script, [`tools/theme.mjs`](tools/theme.mjs). Some
files never go in a zip: `node_modules`, `.git`, `assets/labs`, `*.zip`, logs
and lock files. To exclude more files for one theme, list them in that theme's
`package.json`:

```json
"themeZip": { "exclude": ["assets/videos/**", "server/**"] }
```

## Uploading a theme

1. `npm run scan:zip -w <theme>`
2. In Ghost Admin, open **Settings → Design & branding → Change theme → Upload theme**.
3. Pick `<theme>.zip` from your `zipDir` and activate it.

## Repository layout

```text
ghost-themes/
├── tools/
│   ├── theme.mjs              # shared, cross-platform theme tooling
│   └── templates/             # README and LICENSE templates for new themes
├── ghost.local.example.json   # copy to ghost.local.json (git-ignored)
├── package.json               # workspaces + shared dev dependencies
├── <theme>/
│   ├── package.json           # Ghost theme config + the standard scripts
│   ├── README.md
│   ├── LICENSE
│   └── …                      # .hbs templates, partials/, assets/, locales/
└── …
```

## Resources

**Ghost**
- [Theme structure](https://ghost.org/docs/themes/structure/)
- [Handlebars helpers](https://ghost.org/docs/themes/helpers/) · [translate](https://ghost.org/docs/themes/helpers/translate/)
- [Custom settings](https://ghost.org/docs/themes/custom-settings/)
- [gscan online](https://gscan.ghost.org/)

**Progressive web apps**
- [Learn PWA (web.dev)](https://web.dev/learn/pwa)
- [PWABuilder](https://www.pwabuilder.com/) · [docs](https://docs.pwabuilder.com/)
- [Overview of PWAs (Microsoft Edge)](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/)
- [Web app manifest (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)

## Contributing

Issues and pull requests are welcome. Please run `npm run scan -w <theme>`
before opening a PR, and use [Conventional Commits](https://www.conventionalcommits.org/)
scoped to the theme, for example `fix(2n1): …`.

## Author

**Salaheddin AbuEin** — [abuein.dev](https://abuein.dev/) ·
[GitHub](https://github.com/sabuein) · [LinkedIn](https://www.linkedin.com/in/sabuein/)

## Licence

[MIT](LICENSE) © Salaheddin AbuEin, unless a theme's own `LICENSE` says otherwise.
