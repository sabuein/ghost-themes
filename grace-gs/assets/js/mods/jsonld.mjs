"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 *
 * JSON-LD injector — fetches one or more .jsonld files and inserts each
 * as a <script type="application/ld+json"> block in <head>.
 *
 * Caveat: for SEO this is suboptimal. Crawlers like Googlebot do execute
 * JS, but server-rendered JSON-LD (Pattern A in the README) is more
 * reliable. Use this module only when runtime data is required.
 */

/**
 * @param {string[]} urls - relative or absolute paths to .jsonld files
 * @returns {Promise<void>}
 */
export async function initJsonLd(urls = ["/assets/json/site.jsonld"]) {
    const results = await Promise.allSettled(urls.map(loadOne));
    const failed = results.filter(r => r.status === "rejected");
    if (failed.length) {
        console.warn("[jsonld] failed to load:", failed.map(f => f.reason));
    }
}

async function loadOne(url) {
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    const text = await res.text();
    // Validate it parses; throw early if malformed
    JSON.parse(text);

    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = text;
    tag.dataset.source = url;
    document.head.appendChild(tag);
}