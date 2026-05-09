"use strict";

/**
 * Copyright (c) 2026 AbuEin Technologies — Salaheddin AbuEin <salaheddin@abuein.dev>
 * https://abuein.dev/
 * SPDX-License-Identifier: MIT
 */

/* ── Theme tokens kept in one place so JS and CSS agree ─────────────────── */
const THEME_COLORS = {
    light: '#ffffff',
    dark: '#0a0a0a'
};

/**
 * Apply a theme everywhere it needs to be reflected:
 *   - <html data-theme="…">   → drives all CSS tokens
 *   - <meta name="theme-color"> → drives PWA / browser chrome
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
        // Force both metas to the active color so the browser shows the right chrome
        // regardless of which media-query it's currently matching.
        m.setAttribute("content", THEME_COLORS[theme]);
    });

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        const isDark = theme === "dark";
        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }
}

/**
 * Theme Toggle (Dark/Light Mode)
 */
function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");

    // Resolve the initial theme: saved choice → system preference → light
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    // Always set it — the no-flash boot script in default.hbs already did this,
    // but we re-apply here so meta[theme-color] gets synced too.
    applyTheme(initialTheme);

    // Bail gracefully if the toggle button isn't on this page
    if (!themeToggle) return;

    themeToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";

        applyTheme(next);
        localStorage.setItem("theme", next);
    });

    // Follow OS changes only if the user hasn't picked manually
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            applyTheme(e.matches ? "dark" : "light");
        }
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.getElementById("mobile-toggle");
    const dialog = document.getElementById("nav-links");
    if (!toggle || !dialog) return;

    const mq = window.matchMedia("(max-width: 767px)");

    toggle.addEventListener("click", () => {
        if (!mq.matches) return;          // desktop: do nothing
        if (dialog.open) {
            dialog.close();
            toggle.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        } else {
            dialog.showModal();
            toggle.classList.add("active");
            toggle.setAttribute("aria-expanded", "true");
            toggle.setAttribute("aria-label", "Close menu");
        }
    });

    // Close on link click or backdrop click
    dialog.addEventListener("click", (e) => {
        if (e.target.closest("a") || e.target === dialog) {
            dialog.close();
            toggle.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        }
    });

    // If the viewport grows past mobile while open, close cleanly
    mq.addEventListener("change", (e) => {
        if (!e.matches && dialog.open) {
            dialog.close();
            toggle.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        }
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    const logo = document.querySelector(".logo");
    if (logo) {
        logo.addEventListener("click", (e) => {
            if (location.pathname === "/" || location.pathname === "") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                if (location.hash) {
                    history.replaceState(null, "", location.pathname + location.search);
                }
            }
        });
    }

    // Let the browser do native smooth scrolling for in-page anchors.
    // Only intercept #contact (handled by the dialog).
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href");
            if (href === "#contact") {
                e.preventDefault();
                return; // contact dialog handler takes over
            }
            // Everything else: do nothing, let the browser handle the jump
            // — CSS scroll-behavior + scroll-padding-top already give smooth, header-aware scrolling.
        });
    });
}

/**
 * Header scroll effect
 */
function initHeaderScroll() {
    const header = document.getElementById("header");
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    // passive listener — better scroll performance, no preventDefault here anyway
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // sync state on load (e.g. when reloading mid-page)
}

export {
    initThemeToggle,
    initMobileMenu,
    initSmoothScroll,
    initHeaderScroll
};