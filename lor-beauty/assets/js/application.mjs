import { initDialogs } from "dialog";
import { initPopovers } from "popover";
import { initBackToTop } from "back-to-top";
import { registerServiceWorker } from "./pwa/register.mjs";
import { initInstallPrompt } from "./pwa/install.mjs";
import { isMuted, toggleMuted, playNudge } from "audio";
import { initTheme, getTheme, toggleTheme } from "theme";
import { initVideoPreviews } from "./ui/video.mjs";

function initSoundToggle() {
    document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
        button.setAttribute("aria-pressed", String(!isMuted()));
        button.addEventListener("click", () => {
            const muted = toggleMuted();
            button.setAttribute("aria-pressed", String(!muted));
            // audible confirmation when turning sound on
            if (!muted) playNudge();
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
    initPopovers();
    initSoundToggle();
    initVideoPreviews();
    initBackToTop();

    // Required PWA hooks
    initInstallPrompt();
    await registerServiceWorker();
}

domReady()
    .then(bootstrap)
    .catch((error) => {
        console.error("[app] bootstrap failed:", error);
    });