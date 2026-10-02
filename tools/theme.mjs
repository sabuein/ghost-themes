#!/usr/bin/env node
/*
  tools/theme.mjs: one cross-platform helper for every theme in this repo.
  Works the same on Ubuntu and Windows (cmd, PowerShell, Git Bash).

  Copyright (c) 2026 Salaheddin AbuEin <salaheddin@abuein.dev>
  https://abuein.dev/
  SPDX-License-Identifier: MIT

  Run it from a theme folder (npm scripts do this for you):
    node ../tools/theme.mjs <command>

  Commands:
    start | stop | restart | update | log   Ghost-CLI against your local instance
    debug                                   ghost run -D (foreground, development)
    link | unlink                           (un)link this theme into <ghostDir>/content/themes
    zip                                     build <zipDir>/<theme>.zip, ready to upload
    scan-zip                                gscan the zip produced by "zip"
    info                                    print the resolved settings

  Settings (first match wins):
    1. Environment variables GHOST_DIR and THEME_ZIP_DIR
    2. ghost.local.json at the repo root → "themes": { "<theme>": { ... } }
    3. ghost.local.json at the repo root → top-level "ghostDir" / "zipDir"
    4. Defaults: zipDir = ~/Desktop
*/

import { spawnSync } from "node:child_process";
import {
    createWriteStream, existsSync, lstatSync, mkdirSync,
    readFileSync, readlinkSync, rmSync, symlinkSync
} from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const IS_WIN = process.platform === "win32";
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const THEME_DIR = process.cwd();
const THEME = basename(THEME_DIR);

// Always left out of the theme zip; add theme-specific paths in
// package.json → "themeZip": { "exclude": [ ... ] }
const DEFAULT_EXCLUDES = [
    ".git/**", ".github/**", "node_modules/**",
    "**/*.zip", "**/.gitignore", "**/.DS_Store", "**/Thumbs.db", "**/*.log",
    "package-lock.json", "assets/labs/**"
];

const fail = (msg) => { console.error(`✗ ${msg}`); process.exit(1); };
const ok = (msg) => console.log(`✓ ${msg}`);
const expandHome = (p) => (p ? p.replace(/^~(?=$|[\\/])/, homedir()) : p);

function readJson(file) {
    try { return JSON.parse(readFileSync(file, "utf8")); }
    catch (err) { fail(`Could not read ${file}: ${err.message}`); }
}

function loadSettings() {
    const pkgFile = join(THEME_DIR, "package.json");
    if (THEME_DIR === REPO_ROOT || !existsSync(pkgFile)) {
        fail("Run this from a theme folder, e.g. `npm run zip -w 2n1` or `cd 2n1 && npm run zip`.");
    }
    const pkg = readJson(pkgFile);
    const localFile = join(REPO_ROOT, "ghost.local.json");
    const local = existsSync(localFile) ? readJson(localFile) : {};
    const perTheme = local.themes?.[THEME] ?? {};

    return {
        pkg,
        ghostDir: expandHome(process.env.GHOST_DIR ?? perTheme.ghostDir ?? local.ghostDir),
        zipDir: expandHome(process.env.THEME_ZIP_DIR ?? perTheme.zipDir ?? local.zipDir ?? "~/Desktop"),
        excludes: [...DEFAULT_EXCLUDES, ...(pkg.themeZip?.exclude ?? [])]
    };
}

// Quote for cmd.exe when shell: true is needed to find ghost.cmd / gscan.cmd
const quote = (a) => (IS_WIN && /[\s&()^|<>]/.test(a) ? `"${a}"` : a);

function run(cmd, args) {
    const res = spawnSync(cmd, args.map(quote), { stdio: "inherit", shell: IS_WIN });
    if (res.error) fail(`${cmd}: ${res.error.message}`);
    if (res.status !== 0) process.exit(res.status ?? 1);
}

function requireGhostDir(s) {
    if (!s.ghostDir) {
        fail("No Ghost instance configured. Copy ghost.local.example.json to ghost.local.json " +
            "at the repo root and set \"ghostDir\" (or set GHOST_DIR).");
    }
    if (!existsSync(s.ghostDir)) fail(`Ghost instance not found: ${s.ghostDir}`);
    return s.ghostDir;
}

function ghost(s, sub, extra = []) {
    run("ghost", [sub, ...extra, "-d", requireGhostDir(s)]);
}

function linkPath(s) {
    return join(requireGhostDir(s), "content", "themes", THEME);
}

function isLink(p) {
    try { return lstatSync(p).isSymbolicLink(); } catch { return false; }
}

function link(s) {
    const target = linkPath(s);
    if (isLink(target)) {
        const current = resolve(dirname(target), readlinkSync(target));
        if (current.toLowerCase() === THEME_DIR.toLowerCase()) return ok(`Already linked: ${target}`);
        fail(`${target} already links to ${current}. Run "npm run unlink" first.`);
    }
    if (existsSync(target)) fail(`${target} exists and is not a link — move it aside first.`);
    // "junction" needs no admin rights on Windows; ignored on Linux/macOS
    symlinkSync(THEME_DIR, target, IS_WIN ? "junction" : "dir");
    ok(`Linked ${target} → ${THEME_DIR}`);
    console.log("  Restart Ghost (npm run restart) so it picks the theme up.");
}

function unlink(s) {
    const target = linkPath(s);
    if (!isLink(target)) fail(`${target} is not a link — nothing removed.`);
    rmSync(target, { force: true });
    ok(`Unlinked ${target}`);
}

function zipFile(s) {
    return join(s.zipDir, `${THEME}.zip`);
}

async function zip(s) {
    let ZipArchive;
    try { ({ ZipArchive } = await import("archiver")); }  // archiver >= 8
    catch { fail("archiver is not installed. Run `npm install` at the repo root."); }

    mkdirSync(s.zipDir, { recursive: true });
    const out = zipFile(s);
    rmSync(out, { force: true });

    await new Promise((done, reject) => {
        const stream = createWriteStream(out);
        const archive = new ZipArchive({ zlib: { level: 9 } });
        stream.on("close", done);
        archive.on("warning", (err) => (err.code === "ENOENT" ? console.warn(err.message) : reject(err)));
        archive.on("error", reject);
        archive.pipe(stream);
        archive.glob("**/*", { cwd: THEME_DIR, dot: true, ignore: s.excludes });
        archive.finalize();
    }).catch((err) => fail(`zip failed: ${err.message}`));

    const kb = (lstatSync(out).size / 1024).toFixed(1);
    ok(`Zipped ${THEME} → ${out} (${kb} KB)`);
}

function scanZip(s) {
    const out = zipFile(s);
    if (!existsSync(out)) fail(`${out} not found. Run "npm run zip" first.`);
    run("gscan", ["-z", out]);
}

const COMMANDS = {
    start: (s) => ghost(s, "start"),
    stop: (s) => ghost(s, "stop"),
    restart: (s) => ghost(s, "restart"),
    update: (s) => ghost(s, "update"),
    log: (s) => ghost(s, "log"),
    debug: (s) => ghost(s, "run", ["-D"]),
    link,
    unlink,
    zip,
    "scan-zip": scanZip,
    info: (s) => console.log({
        theme: THEME, themeDir: THEME_DIR, ghostDir: s.ghostDir ?? null,
        zip: zipFile(s), excludes: s.excludes
    })
};

const [command] = process.argv.slice(2);
if (!COMMANDS[command]) {
    fail(`Unknown command "${command ?? ""}". Use one of: ${Object.keys(COMMANDS).join(", ")}`);
}
await COMMANDS[command](loadSettings());
