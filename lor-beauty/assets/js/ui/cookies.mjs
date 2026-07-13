const CONSENT_KEY = "lor-cookie-consent-v1";
// allowed values: "accepted" | "declined" | "unset"

export function getConsent() {
    try {
        const value = localStorage.getItem(CONSENT_KEY);
        return value === "accepted" || value === "declined" ? value : "unset";
    } catch {
        return "unset";
    }
}

export function setConsent(value) {
    if (value !== "accepted" && value !== "declined") return;
    try {
        localStorage.setItem(CONSENT_KEY, value);
    } catch {
        // ignore storage errors
    }

    document.dispatchEvent(
        new CustomEvent("lor:consent-changed", {
            detail: { consent: value }
        })
    );
}

export function hasConsentDecision() {
    return getConsent() !== "unset";
}

export function canRunOptionalScripts() {
    return getConsent() === "accepted";
}

/**
 * Wire consent dialog behavior.
 * Requires dialog markup with id="cookie-consent" and buttons:
 * [data-cookie-action="accept"|"decline"|"manage"]
 */
export function initCookieConsent() {
    const dialog = document.getElementById("cookie-consent");
    if (!(dialog instanceof HTMLDialogElement)) return;

    const current = getConsent();

    // Show only if not decided yet
    if (current === "unset" && !dialog.open) {
        dialog.showModal();
    }

    const acceptBtn = dialog.querySelector('[data-cookie-action="accept"]');
    const declineBtn = dialog.querySelector('[data-cookie-action="decline"]');
    const manageBtn = dialog.querySelector('[data-cookie-action="manage"]');

    acceptBtn?.addEventListener("click", () => {
        setConsent("accepted");
        dialog.close("accepted");
    });

    declineBtn?.addEventListener("click", () => {
        setConsent("declined");
        dialog.close("declined");
    });

    manageBtn?.addEventListener("click", () => {
        // Placeholder for category-level preferences dialog later.
        // For now just keep it open (or you can route to privacy page).
        window.location.href = "/privacy/";
    });
}