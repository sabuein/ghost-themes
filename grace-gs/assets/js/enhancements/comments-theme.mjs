"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 */

export function initComments() {
    const MOUNT = document.querySelector("[data-comments-mount]");
    if (MOUNT) {
        const apply = () => {
            const theme = document.documentElement.getAttribute("data-theme") || "auto";
            // Re-render the comments helper output with the right scheme.
            // Strategy: clone the original <script> the helper emitted,
            // patch data-color-scheme, replace the iframe.
            const oldScript = MOUNT.querySelector('script[src*="comments-ui"]');
            if (!oldScript) return;
            const root = MOUNT.querySelector("#ghost-comments-root");
            if (root) root.innerHTML = "";
            const next = document.createElement("script");
            for (const a of oldScript.attributes) next.setAttribute(a.name, a.value);
            next.setAttribute("data-color-scheme", theme === "dark" ? "dark" : theme === "light" ? "light" : "auto");
            oldScript.replaceWith(next);
        };
        apply();
        // Re-mount on theme toggle
        new MutationObserver((muts) => {
            if (muts.some(m => m.attributeName === "data-theme")) apply();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
}