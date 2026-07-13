let deferredPrompt = null;

export function initInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredPrompt = event;
        document.dispatchEvent(new CustomEvent("lor:pwa-install-available"));
    });
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