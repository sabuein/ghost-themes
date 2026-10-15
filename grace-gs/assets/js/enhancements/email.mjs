"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 */

/**
 * Enhances the contact form: validation, inline status,
 * honeypot + timing checks, then a native submit so
 * Formspree's CAPTCHA redirect works.
 */
const MIN_FILL_TIME_MS = 400;   // catches instant bot fill+submit, tolerates autofill

export function initEmail() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    // Stamp the start time when the user first interacts; stamp() only
    // writes when empty, so this can safely re-arm after form.reset().
    const started = form.querySelector('[name="_started"]');
    const stamp = () => { if (!started.value) started.value = String(Date.now()); };
    form.addEventListener("focusin", stamp);

    // Back button from Formspree may restore this page from bfcache mid-"Sending…"
    window.addEventListener("pageshow", (e) => {
        if (!e.persisted) return;
        form.querySelector('[type="submit"]').disabled = false;
        form.querySelector(".form-status")?.remove();
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) { form.reportValidity(); return; }

        // Bot checks (honeypot + timing)
        const hp = form.querySelector('[name="hp_notes"]');
        if (hp && hp.value) return setStatus(form, "ok", "Thanks!"); // silently drop
        const elapsed = Date.now() - Number(started.value || 0);
        if (elapsed < MIN_FILL_TIME_MS) return setStatus(form, "ok", "Thanks!");

        const submitBtn = form.querySelector('[type="submit"]');

        // Formspree CAPTCHA needs a real page navigation, so it can't run offline or via fetch()
        if (!navigator.onLine) {
            setStatus(form, "error", "You're offline. Please try again when you're back online.");
            return;
        }

        submitBtn.disabled = true;
        setStatus(form, "loading", "Sending…");

        // Native submit: follows Formspree's CAPTCHA redirect like the other themes
        // (form.submit() doesn't fire the submit event, so no loop)
        form.submit();
    });
}

function setStatus(form, kind, message) {
    let el = form.querySelector(".form-status");
    if (!el) {
        el = document.createElement("p");
        el.className = "form-status";
        el.setAttribute("role", "status");
        el.setAttribute("aria-live", "polite");
        form.append(el);
    }
    el.dataset.kind = kind;
    el.textContent = message;
}