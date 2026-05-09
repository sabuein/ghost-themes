// assets/scripts/clean.js
import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROOT = "assets";
const PATTERN = /\.min\.(css|m?js)$/;

function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (PATTERN.test(entry.name)) {
            rmSync(p);
            console.log("✓ removed", p);
        }
    }
}

walk(ROOT);