"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 *
 * Sharing — progressive enhancement.
 *
 * Reads canonical URL + metadata from data-* attributes on .post-sharing,
 * builds platform-specific share URLs at runtime, and wires up:
 *   - Web Share API button (when supported)
 *   - copy-link button
 *
 * The .share-fallback <details> is the no-JS-but-modern-browsers path —
 * its href="#" placeholders get replaced once initShare() runs.
 */

/**
 * Build the per-platform URL set for a canonical link.
 * @param {{ url: string, title?: string, text?: string }} meta
 */
function buildShareUrls({ url, title = "", text = "" }) {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const x = encodeURIComponent(text);
    const body = x ? `${x}%0A%0A${u}` : u;

    return {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        twitter: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        email: `mailto:?subject=${t}&body=${body}`
    };
}

/**
 * Wire a single .post-sharing block.
 * @param {HTMLElement} root
 */
function wireSharingBlock(root) {
    const url = root.dataset.shareUrl;
    const title = root.dataset.shareTitle;
    const text = root.dataset.shareText;

    if (!url) return;

    // Populate fallback hrefs
    const urls = buildShareUrls({ url, title, text });
    root.querySelectorAll("[data-share-target]").forEach((a) => {
        const target = a.dataset.shareTarget;
        if (urls[target]) a.setAttribute("href", urls[target]);
    });

    // Native Web Share API
    const native = root.querySelector(".share-native");
    const fallback = root.querySelector(".share-fallback");

    if (native && "share" in navigator) {
        native.hidden = false;
        if (fallback) fallback.hidden = true;

        native.addEventListener("click", async () => {
            try {
                await navigator.share({ url, title, text });
            } catch (err) {
                if (err.name !== "AbortError") console.warn("[share]", err);
            }
        });
    }

    // Copy-link button
    const copy = root.querySelector(".share-copy");
    if (copy) {
        copy.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(url);
                copy.classList.add("copied");
                setTimeout(() => copy.classList.remove("copied"), 1500);
            } catch (err) {
                console.warn("[share] clipboard write failed:", err);
            }
        });
    }
}

export function initShare() {
    document.querySelectorAll(".post-sharing").forEach(wireSharingBlock);
}