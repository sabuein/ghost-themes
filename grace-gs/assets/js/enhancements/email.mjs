"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 */

/**
 * Enhances the contact form: AJAX submit, inline status,
 * offline queueing, honeypot + timing checks.
 */

const MIN_FILL_TIME_MS = 1500;   // humans take >1.5s to fill the form

export function initEmail() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    // Stamp the start time when the user first interacts
    const started = form.querySelector('[name="_started"]');
    const stamp = () => { if (!started.value) started.value = String(Date.now()); };
    form.addEventListener("focusin", stamp, { once: true });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) { form.reportValidity(); return; }

        // Bot checks (honeypot + timing)
        const hp = form.querySelector('[name="company_url"]');
        if (hp && hp.value) return setStatus(form, "ok", "Thanks!"); // silently drop
        const elapsed = Date.now() - Number(started.value || 0);
        if (elapsed < MIN_FILL_TIME_MS) return setStatus(form, "ok", "Thanks!");

        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        setStatus(form, "loading", "Sending…");

        const payload = Object.fromEntries(new FormData(form));

        try {
            const res = await fetch(form.action, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            form.reset();
            started.value = "";
            setStatus(form, "ok", "Thanks — we'll get back to you shortly.");

            // Close the dialog after a short delay
            setTimeout(() => {
                document.getElementById("contact-dialog")?.close("submitted");
            }, 1500);
        } catch (err) {
            // If we're offline (or the worker is down), queue for later
            if (!navigator.onLine && "serviceWorker" in navigator) {
                await queueForBackgroundSync(form.action, payload);
                setStatus(form, "ok", "You're offline — we'll send this when you're back.");
                form.reset();
            } else {
                setStatus(form, "error", "Something went wrong. Please email us directly.");
                console.warn("[email] submit failed:", err);
            }
        } finally {
            submitBtn.disabled = false;
        }
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

async function queueForBackgroundSync(url, payload) {
    const reg = await navigator.serviceWorker.ready;
    // Send to SW via postMessage; SW will use Background Sync API
    reg.active?.postMessage({ type: "queue-contact", url, payload });
    if ("sync" in reg) await reg.sync.register("contact-submit");
}