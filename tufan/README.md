# 🌊 Tufan: indie publishing and community media platform (MVP)

- **Live site:** [tufan.uk](https://tufan.uk/)
- **Version:** 1.0.0 · **Ghost:** `>=6.67.0` · **Licence:** [MIT](LICENSE)
- **Author:** [Salaheddin AbuEin](https://abuein.dev/)

**Tufan** is a progressive web app (PWA) powered by **Ghost CMS** with a minimal custom backend.  
We treat Ghost as our modern, headless CMS — handling authentication, memberships, subscriptions, roles, editing, and APIs — while Tufan focuses on the viewer experience and media extras.

---

## Operating model (creators self‑publish)

### Channel owners are Ghost “staff”
- Creators apply or **contact us for an invite**.  
- We create a **Ghost staff account** for them (role: **Author**) and send the invitation.  
- Once accepted, **Authors log in at `/ghost`** to create, edit, and publish **their own** posts and pages.  
- **Editors/Administrators** remain for platform‑level tasks (moderation, settings, tiers/pricing, themes), not day‑to‑day publishing.

This means **creators self‑publish** — the platform team isn’t responsible for posting on their behalf.

> Authors only see and manage their own content in Ghost Admin by design. Editors/Admins can help if needed, but creators are first‑class publishers.

---

## Channels, posts & pages (simple conventions)

### Authors ↔ Channels
Every Ghost **Author** corresponds to a **Channel**, available at:  
`https://tufan.uk/@username`

### Posts (feed content)
- **Videos** → Post tagged `video`
- **Shorts** → Post tagged `short`
- **Featured** (optional) → tag `featured`

Posts inherit Ghost visibility (Public, Members, Paid, Specific tiers). Tufan’s frontend respects `access` and shows previews/CTAs when locked.

### Pages (optional, static tabs)
- **About** → Page tagged `about` (bio, links)
- **Store** → Page tagged `store` (renders products from Tufan backend; payouts go directly to creators)
- **Playlists** → Page tagged `playlists` (curated lists; data via backend)

Keep one About/Store/Playlists page per channel for clarity.

---

## Roles & access

- **Author (Channel Owner)** — Self‑publishes posts/pages; manages their profile, avatar, bio, and social links in **Ghost Admin** (`/ghost`).  
- **Editor / Administrator (Platform team)** — Moderation, routing/theme changes, membership tiers, platform settings.  
- **Members / Paid Members** — Managed by Ghost; the PWA enforces access rules automatically.

There is **no separate “Creator Studio”** — Ghost Admin *is* the studio.

---

## URL structure (per channel)

- Channel home: `https://tufan.uk/@username`
- Videos: `https://tufan.uk/@username/videos/` (posts tagged `video`)
- Shorts: `https://tufan.uk/@username/shorts/` (posts tagged `short`)
- Playlists: `https://tufan.uk/@username/playlists/`
- Store: `https://tufan.uk/@username/store/`
- About: `https://tufan.uk/@username/about/`

Individual post (video/short):  
`https://tufan.uk/@username/{post-slug}`

Optional site‑level feeds:  
- Members: `https://tufan.uk/members/`  
- Paid: `https://tufan.uk/paid/`  
- Specific tiers: `https://tufan.uk/tier/gold/`, `https://tufan.uk/tier/silver/`

---

## Visibility, gating & previews

- Ghost enforces content access at API level (members, paid, tiers).  
- The PWA renders full content if accessible, otherwise a **locked preview** with sign‑in/upgrade CTAs.

---

## Stores & playlists (Tufan backend)

- **Store tab** → Products (image/video, title, description, price, buy button). Payments via Stripe/PayPal directly to creators.  
- **Playlists** → Creator‑curated post lists managed in the backend; post details resolved via Ghost Content API.

---

## PWA features
- Installable (Add to Home Screen)
- Offline caching (core shell + recent content)
- Push notifications for new content (opt‑in)

---

## Project structure (MVP)

- `client/` — PWA (HTML, CSS, JS), manifest, service worker  
- `server/` — Node/Express backend (Admin API proxy, Store/Playlists endpoints)  
- `ghost/` — Ghost config, theme, `routes.yaml`  
- `README.md` — This document

---

## Roadmap (media & scale)

1) **MVP**
   - Ghost integration (auth, membership, Stripe).
   - Channel home + Videos + Shorts + About.
   - Basic upload/playback (server storage).

2) **Efficient file storage**
   - Object storage (S3/B2/MinIO) for cost‑effective durability.
   - Lifecycle policies; signed URLs for secure delivery.

3) **VOD streaming**
   - Transcoding with FFmpeg to multiple renditions.  
   - HLS/DASH delivery with adaptive bitrate.  
   - Optional CDN integration for global performance.

4) **Live streaming (future)**
   - RTMP ingest → real‑time HLS/DASH output.  
   - Auto‑archive to VOD (publish as a post).  
   - Chat/reactions (phase 2).

5) **Community & growth**
   - Comments, likes, follows, notifications.  
   - Internationalisation, moderation tools, analytics.

---

## Onboarding workflow (for creators)

1) Creator contacts us to request a channel.  
2) Platform admin creates a **Ghost Author** and sends an invite.  
3) Creator accepts, logs into **/ghost**, sets profile/avatar/links.  
4) Creator publishes posts/pages with the agreed tags (`video`, `short`, `about`, `store`, `playlists`) and visibility.  
5) Tufan frontend renders their channel at `/@username` and tabs.

---

## Guardrails
- Keep special tags consistent: `video`, `short`, `featured`, `about`, `store`, `playlists`.  
- One static page per channel for About/Store/Playlists.  
- If an author (channel) slug changes, update mappings and URLs accordingly (or restrict outside Admin).

## Resources

- [Ghost Configuration](https://ghost.org/docs/config/)
- [Ghost Handlebars Theme Structure](https://ghost.org/docs/themes/structure/)
- [Ghost Theme Development: Building custom membership flows](https://ghost.org/docs/themes/members/)
- [Custom settings are the ultimate power-up for Ghost themes](https://ghost.org/tutorials/custom-settings/)
- [Ghost Themes - Dynamic URLs & Routing](https://ghost.org/docs/themes/routing/)
- [Implementing redirects in Ghost](https://ghost.org/tutorials/implementing-redirects/)
- [Building content collections in Ghost](https://ghost.org/tutorials/content-collections/)
- [Mailgun API documentation: Sending via SMTP](https://documentation.mailgun.com/en/latest/user_manual.html#sending-via-smtp)
- [Linode Docs - Add DNS Records](https://www.linode.com/docs/products/networking/dns-manager/get-started/#add-dns-records)
- [How To Configure rDNS (Reverse DNS) on a Compute Instance](https://www.linode.com/docs/products/compute/compute-instances/guides/configure-rdns/)
- [The upload limit is effectively determined by the web server that's serving your Ghost site and you have full control over that: Navigate to your Ghost installation folder, open the NGINX config file, and modify the client_max_body_size value.](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
- [URLs & Dynamic Routing - Ghost Developer Docs](https://docs.ghost.org/themes/routing)

## Getting started

From the repo root (one-off setup is in the [main README](../README.md#getting-started)):

```bash
npm install
npm run link -w tufan
npm restart -w tufan
```

Then activate **tufan** in Ghost Admin under **Settings → Design & branding → Change theme**.

## Scripts

Run these inside `tufan/`, or from the repo root with `-w tufan` added.

| Command | What it does |
| --- | --- |
| `npm start` / `npm stop` / `npm restart` | Control your local Ghost |
| `npm run debug` | `ghost run -D` (foreground, development mode) |
| `npm run log` / `npm run update` | `ghost log` / `ghost update` |
| `npm run link` / `npm run unlink` | Link this theme into Ghost's `content/themes` |
| `npm run scan` | Validate with gscan |
| `npm run zip` | Write `tufan.zip`, ready to upload |
| `npm run scan:zip` | Zip, then validate the zip |

## Theme settings

Edit these in Ghost Admin under **Settings → Design & branding → Customise**.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `linkedin_url` | text | `https://www.linkedin.com/in/sabuein/` |  |
| `github_url` | text | `https://github.com/sabuein/ghost-themes/tree/main/tufan` |  |

## Credits

Designed and built by **[Salaheddin AbuEin](https://abuein.dev/)**. Part of the [ghost-themes](../README.md) collection.

## Licence

[MIT](LICENSE) © 2023-2026 Salaheddin AbuEin
