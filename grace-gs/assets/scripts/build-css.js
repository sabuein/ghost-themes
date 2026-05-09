// assets/scripts/build-css.js
import { readFileSync, writeFileSync } from "node:fs";

const ORDER = [
    "base/reset",
    "base/tokens",
    "base/elements",
    "base/utilities",
    "components/buttons",
    "components/nav",
    "components/hero",
    "components/section",
    "components/about",
    "components/products",
    "components/features",
    "components/clients",
    "components/faq",
    "components/newsletter",
    "components/post-card",
    "components/error",
    "components/pagination",
    "components/comments",
    "components/cta",
    "components/footer",
    "components/cookie-notice",
    "components/dialog",
    "overrides/responsive",
    "overrides/motion",
    "ghost/required"
];

const HEADER = "@layer reset,tokens,base,utilities,components,overrides,ghost;\n";
const TARGET = "assets/css/screen.css";

const out = HEADER + ORDER
    .map((n) => readFileSync(`assets/css/${n}.css`, "utf8"))
    .join("\n");

writeFileSync(TARGET, out);
console.log("✓", TARGET, `(${ORDER.length} layers)`);