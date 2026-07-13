import { playNudge } from "../utils/audio.mjs";

const REGION_ID = "toast-region";
const DEFAULT_DURATION = 5000;

let counter = 0;

function getRegion() {
    let region = document.getElementById(REGION_ID);
    if (!region) {
        region = document.createElement("div");
        region.id = REGION_ID;
        region.className = "toast-region";
        region.setAttribute("role", "status");
        region.setAttribute("aria-live", "polite");
        document.body.appendChild(region);
    }
    return region;
}

/**
 * @param {string} message
 * @param {object} [options]
 * @param {'info'|'success'|'error'} [options.type]
 * @param {number} [options.duration] - ms before auto-dismiss. 0 = sticky.
 * @param {boolean} [options.sound] - play nudge sound; default true.
 * @param {{ backend?: 'file'|'tone'|'system'|'off', title?: string, body?: string, volume?: number, nudgeSrc?: string }} [options.nudge]
 * @param {{ label: string, onClick: () => void }} [options.action]
 * @returns {{ id: string, dismiss: () => void }}
 */
export function showToast(message, options = {}) {
    const {
        type = "info",
        duration = DEFAULT_DURATION,
        sound = true,
        nudge = {},
        action,
    } = options;

    const id = `toast-${++counter}`;
    const region = getRegion();

    const toast = document.createElement("div");
    toast.id = id;
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "alert");

    const text = document.createElement("p");
    text.className = "toast-message";
    text.textContent = message;
    toast.appendChild(text);

    let timeoutId = null;

    const dismiss = () => {
        if (timeoutId) clearTimeout(timeoutId);
        toast.remove();
    };

    if (action) {
        const actionButton = document.createElement("button");
        actionButton.type = "button";
        actionButton.className = "toast-action";
        actionButton.textContent = action.label;
        actionButton.addEventListener("click", () => {
            try {
                action.onClick();
            } finally {
                dismiss();
            }
        });
        toast.appendChild(actionButton);
    }

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "toast-close";
    closeButton.setAttribute("aria-label", "Dismiss");
    closeButton.addEventListener("click", dismiss);
    toast.appendChild(closeButton);

    region.appendChild(toast);

    if (sound) {
        // Fire-and-forget: toast UI should never block on audio/permissions.
        playNudge({
            title: nudge.title || "Notification",
            body: nudge.body || message,
            backend: nudge.backend,
            volume: nudge.volume,
            nudgeSrc: nudge.nudgeSrc,
        }).catch(() => {});
    }

    if (duration > 0) {
        timeoutId = setTimeout(dismiss, duration);
    }

    return { id, dismiss };
}

export function dismissAll() {
    getRegion()
        .querySelectorAll(".toast")
        .forEach((toast) => toast.remove());
}
