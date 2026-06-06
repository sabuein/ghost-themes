"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 */

export function initViewTransitions() {

    if ("startViewTransition" in document) {
        document.documentElement.classList.add('view-transitions-enabled');
    }
}