// assets/js/utils/theme.mjs
// Manages light/dark theme preference: reads/writes localStorage, respects
// prefers-color-scheme when the user hasn't chosen explicitly, and applies
// the choice as a `data-theme` attribute on <html> — what that attribute
// actually looks like is entirely up to the CSS layer, not this file.
//
// Note: the *first* application of the saved theme happens via a tiny
// inline, non-module script in default.hbs — that one runs synchronously
// before CSS paints, which is what actually prevents the flash. This module
// re-applies/manages theme after that (toggle button, reacting to system
// preference changes, keeping localStorage in sync).

const STORAGE_KEY = "lor-theme";
const THEMES = ["light", "dark"];

function prefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (THEMES.includes(saved)) return saved;
    return prefersDark() ? "dark" : "light";
}

export function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

export function setTheme(theme) {
    if (!THEMES.includes(theme)) return;
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
}

export function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    setTheme(next);
    return next;
}

export function initTheme() {
    applyTheme(getTheme());

    // If the visitor hasn't explicitly picked a theme, keep following the OS.
    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (event) => {
            if (localStorage.getItem(STORAGE_KEY)) return;
            applyTheme(event.matches ? "dark" : "light");
        });
}
