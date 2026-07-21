let deferredPrompt = null;

function initInstallButton() {
    const buttons = document.querySelectorAll("[data-pwa-install]");
    if (!buttons.length) return;

    document.addEventListener("lor:pwa-install-available", () => {
        buttons.forEach((b) => (b.hidden = false));
    });

    buttons.forEach((b) =>
        b.addEventListener("click", async () => {
            const { outcome } = await promptInstall();
            if (outcome === "accepted") buttons.forEach((x) => (x.hidden = true));
        }),
    );

    window.addEventListener("appinstalled", () => {
        buttons.forEach((b) => (b.hidden = true));
    });
}

export function initInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredPrompt = event;
        document.dispatchEvent(new CustomEvent("lor:pwa-install-available"));
    });
    initInstallButton();
}

export function canPromptInstall() {
    return Boolean(deferredPrompt);
}

export async function promptInstall() {
    if (!deferredPrompt) return { outcome: "unavailable" };

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return result; // { outcome: 'accepted'|'dismissed', platform: ...}
}
