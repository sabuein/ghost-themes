// assets/scripts/minify-js.js
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { minify } from "terser";

// Explicit paths only — no project-root walk
const DIRS = ["assets/js"];
const FILES = ["service-worker.mjs"];

const OPTS = {
    module: true,
    ecma: 2022,
    compress: { passes: 2, drop_console: false },
    mangle: true,
    format: { comments: /^!|@preserve|@license|@cc_on/i },
    sourceMap: { url: "inline" }
};

async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(p);
        else yield p;
    }
}

const isSourceJs = (p) =>
    (p.endsWith(".mjs") || p.endsWith(".js")) &&
    !p.includes(".min.");

async function minifyFile(file) {
    const code = readFileSync(file, "utf8");
    const { code: out } = await minify(code, OPTS);
    const target = file.replace(/\.(mjs|js)$/, ".min.$1");
    writeFileSync(target, out);
    console.log("✓", target);
}

for (const dir of DIRS) {
    for await (const file of walk(dir)) {
        if (isSourceJs(file)) await minifyFile(file);
    }
}
for (const file of FILES) {
    if (existsSync(file)) await minifyFile(file);
}