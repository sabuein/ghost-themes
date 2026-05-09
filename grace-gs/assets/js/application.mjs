"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 */

/**
 * Grace Governance Solutions - Main JavaScript
 */

import { initThemeToggle, initMobileMenu, initSmoothScroll, initHeaderScroll } from "nav";
import { initPWA } from "pwa";
import { initJsonLd } from "jsonld";
import { initPagination } from "pagination";

// DOMContentLoaded is redundant
// We ship application.mjs with type="module", which is deferred by default; the DOMContentLoaded wrapper is unnecessary
// document.addEventListener('DOMContentLoaded', () => { });

try {

  // PWA boot — happens after load, doesn't block first paint
  window.addEventListener("load", initPWA);

  initThemeToggle();
  initMobileMenu();
  initCookieNotice();
  initContactDialog();
  initSmoothScroll();
  initHeaderScroll();
  initForms();
  initJsonLd().catch(() => { /* non-fatal */ });
  initPagination();

} catch (error) {
  console.log("Something went wrong.");
  console.error(error);
}

/**
 * Cookie Notice
 */
function initCookieNotice() {
  const cookieNotice = document.getElementById('cookie-notice');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  // Check if user has already responded
  const cookieConsent = localStorage.getItem('cookieConsent');

  if (!cookieConsent) {
    // Show cookie notice after a short delay
    setTimeout(() => {
      cookieNotice.classList.add('show');
    }, 1000);
  }

  acceptBtn?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieNotice.classList.remove('show');
  });

  declineBtn?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieNotice.classList.remove('show');
  });
}

/**
 * Contact Dialog (native <dialog>)
 * @returns {void}
 */
function initContactDialog() {
  /** @type {HTMLDialogElement | null} */
  const dialog = document.getElementById('contact-dialog');
  if (!dialog) return;

  const openDialog = () => {
    if (dialog.open) return;
    dialog.showModal();
    // Focus first input (browser focuses the close button by default)
    queueMicrotask(() => dialog.querySelector('input:not([tabindex="-1"])')?.focus());
  };

  // Bind the floating "Contact" button (if present)
  document.getElementById('contact-btn')?.addEventListener('click', openDialog);

  // Bind any nav/CTA link pointing at #contact
  document.querySelectorAll('a[href="#contact"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openDialog();
    });
  });

  // Close on backdrop click (clicks land on <dialog> itself, not its children)
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close('backdrop');
  });

  // Esc, focus trap, focus return — handled by the browser. Nothing to do here.
}

/**
 * Form Submissions
 */
function initForms() {
  // Contact Form
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    // Native validation before we proceed
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(contactForm));
    console.log("Contact form submitted:", data);

    contactForm.reset();
    /** @type {HTMLDialogElement | null} */
    const dialog = document.getElementById('contact-dialog');
    dialog?.close('submitted');
  });

  // Newsletter Form
  const newsletterForm = document.getElementById("newsletter-form");
  if (!newsletterForm) return;
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = newsletterForm.querySelector('input[type="email"]').value;

    // Simulate subscription
    console.log("Newsletter subscription:", email);

    // Show success message
    const status = document.getElementById('newsletter-status');
    status.textContent = "Thank you for subscribing — check your email.";
    newsletterForm.reset();
    setTimeout(() => { status.textContent = ""; }, 6000);

    // Reset form
    newsletterForm.reset();
  });
}