import { initDialogs } from "dialog";
import { registerServiceWorker } from "./pwa/register.mjs";
import { initInstallPrompt } from "./pwa/install.mjs";
import { initTheme, getTheme, toggleTheme } from "./utils/theme.mjs";
import { isMuted, toggleMuted } from "./utils/audio.mjs";

function initSoundToggle() {
    document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
        button.setAttribute("aria-pressed", String(!isMuted()));
        button.addEventListener("click", () => {
            const muted = toggleMuted();
            button.setAttribute("aria-pressed", String(!muted));
        });
    });
}

function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        const sync = () => button.setAttribute("aria-pressed", String(getTheme() === "dark"));
        sync();
        button.addEventListener("click", () => {
            toggleTheme();
            sync();
        });
    });
}

function domReady() {
    return document.readyState === "loading"
        ? new Promise((resolve) =>
              document.addEventListener("DOMContentLoaded", resolve, {
                  once: true,
              }),
          )
        : Promise.resolve();
}

async function bootstrap() {
    // Required global UI behavior
    initTheme();
    initThemeToggle();
    initDialogs();
    initSoundToggle();

    // Required PWA hooks
    initInstallPrompt();
    await registerServiceWorker();
}

domReady()
    .then(bootstrap)
    .catch((error) => {
        console.error("[app] bootstrap failed:", error);
    });