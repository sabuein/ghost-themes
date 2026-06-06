import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { transform } from "lightningcss";

const ROOT = "assets/css";
const targets = { chrome: 95 << 16, firefox: 90 << 16, safari: 14 << 16 };

function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) { walk(p); continue; }
        if (!entry.name.endsWith(".css")) continue;
        if (entry.name.endsWith(".min.css")) continue;       // skip already-minified
        const out = p.replace(/\.css$/, ".min.css");
        const { code } = transform({
            filename: p,
            code: readFileSync(p),
            minify: true,
            targets,
        });
        writeFileSync(out, code);
        console.log("✓", out);
    }
}
walk(ROOT);