"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 *
 * Pagination enhancer — populates numbered links beyond the first/current/last
 * that the server-rendered pagination provides. Truncates with ellipses for
 * long page sets (e.g. 1 … 4 5 6 … 20).
 */

export function initPagination() {
    const list = document.querySelector(".pagination-pages");
    if (!list) return;

    const current = parseInt(list.dataset.currentPage, 10);
    const total = parseInt(list.dataset.totalPages, 10);
    if (!current || !total || total < 2) return;

    // How many pages to show on each side of the current page
    const SIBLINGS = 1;
    // Always include first + last
    const pages = computePageList(current, total, SIBLINGS);

    list.innerHTML = pages.map(p => {
        if (p === "…") {
            return `<li><span class="pagination-ellipsis" aria-hidden="true">…</span></li>`;
        }
        if (p === current) {
            return `<li><span class="pagination-link is-current" aria-current="page">${p}</span></li>`;
        }
        return `<li><a class="pagination-link" href="${pageUrl(p)}">${p}</a></li>`;
    }).join("");
}

function computePageList(current, total, siblings) {
    const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const total7OrLess = total <= 2 * siblings + 5;
    if (total7OrLess) return range(1, total);

    const left = Math.max(current - siblings, 2);
    const right = Math.min(current + siblings, total - 1);

    const showLeftDots = left > 2;
    const showRightDots = right < total - 1;

    const out = [1];
    if (showLeftDots) out.push("…");
    out.push(...range(left, right));
    if (showRightDots) out.push("…");
    out.push(total);
    return out;
}

function pageUrl(n) {
    // Ghost's URL pattern: / for page 1, /page/N/ for page N>1
    return n === 1 ? "/" : `/page/${n}/`;
}