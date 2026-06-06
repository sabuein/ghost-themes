// assets/scripts/minify-css.js
import { readFileSync, writeFileSync } from "node:fs";
import { bundle } from "lightningcss";

const SOURCE = "assets/css/screen.css";
const TARGET = "assets/css/screen.min.css";

const { code } = bundle({
    filename: SOURCE,
    minify: true,
    targets: { chrome: 95 << 16, firefox: 90 << 16, safari: 14 << 16 } // adjust to your ">= 0.25%" baseline
});

writeFileSync(TARGET, code);
console.log("✓", TARGET);