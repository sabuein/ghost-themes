import { initDialogs } from "./ui/dialog.mjs";
import { registerServiceWorker } from "./pwa/register.mjs";
import { initInstallPrompt } from "./pwa/install.mjs";

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
    initDialogs();

    // Required PWA hooks
    initInstallPrompt();
    await registerServiceWorker();
}

domReady()
    .then(bootstrap)
    .catch((error) => {
        console.error("[app] bootstrap failed:", error);
    });