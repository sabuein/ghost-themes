// assets/js/ui/toast.mjs
//
// Vanilla toast/snackbar system — a non-blocking, auto-dismissing message
// that appears (typically at a screen edge) without stopping the visitor
// from doing anything else. This is the built-in replacement for
// alert()/confirm()-style feedback in this theme: "Added to cart",
// "Copied to clipboard", "Couldn't save — try again," etc.
//
// Unlike alert(), showToast() never blocks the page, never returns a value
// synchronously, and more than one can (briefly) be on screen at once.
//
// ---------------------------------------------------------------------
// OPTIONAL SOUND ("nudge")
// ---------------------------------------------------------------------
// Each toast can optionally play a short sound when it appears — a "nudge."
// This reuses utils/audio.mjs entirely (its own mute/volume state), so:
//  - if the visitor has muted sound (via audio.mjs's setMuted(true), or the
//    nav toggle button below), nudges stay silent automatically —
//    showToast() doesn't need to check that itself.
//  - the actual sound file lives at NUDGE_SOUND_SRC below; no audio file
//    ships with the theme yet, so update that path once you have one.
//
// A ready-made "toggle notification sounds" button lives in
// utils/audio.mjs as initSoundToggleButton() — see partials/header.hbs for
// the markup it expects.
//
// ---------------------------------------------------------------------
// USAGE
// ---------------------------------------------------------------------
//   import { showToast } from '../ui/toast.mjs';
//
//   showToast('Added to cart');
//   showToast('Something went wrong — please try again.', { type: 'error' });
//   showToast('Item removed', { sound: false }); // opt this one out of sound
//
//   // With an action button (e.g. "Undo"):
//   showToast('Item removed', {
//     action: { label: 'Undo', onClick: () => restoreItem(item) },
//   });
//
//   // A toast that shouldn't auto-dismiss (e.g. "update available"):
//   showToast('A new version is available.', {
//     duration: 0,
//     action: { label: 'Refresh Now', onClick: () => location.reload() },
//   });

import { play } from "../utils/audio.mjs";

const REGION_ID = "toast-region";
const DEFAULT_DURATION = 5000;
const NUDGE_SOUND_SRC = "/assets/audio/nudge.mp3"; // TODO: add the actual audio file

let counter = 0;

function getRegion() {
    let region = document.getElementById(REGION_ID);
    if (!region) {
        region = document.createElement("div");
        region.id = REGION_ID;
        region.className = "toast-region";
        // A live region so screen readers announce toasts as they appear,
        // without needing focus to move there.
        region.setAttribute("role", "status");
        region.setAttribute("aria-live", "polite");
        document.body.appendChild(region);
    }
    return region;
}

/**
 * @param {string} message
 * @param {object} [options]
 * @param {'info'|'success'|'error'} [options.type] - drives the `toast-{type}` class.
 * @param {number} [options.duration] - ms before auto-dismiss. 0 = stays until dismissed.
 * @param {boolean} [options.sound] - play the nudge sound on show. Defaults to true.
 * @param {{ label: string, onClick: () => void }} [options.action] - optional button.
 * @returns {{ id: string, dismiss: () => void }}
 */
export function showToast(message, options = {}) {
    const {
        type = "info",
        duration = DEFAULT_DURATION,
        sound = true,
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

    if (action) {
        const actionButton = document.createElement("button");
        actionButton.type = "button";
        actionButton.className = "toast-action";
        actionButton.textContent = action.label;
        actionButton.addEventListener("click", () => {
            action.onClick();
            dismiss();
        });
        toast.appendChild(actionButton);
    }

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "toast-close";
    closeButton.setAttribute("aria-label", "Dismiss");
    closeButton.addEventListener("click", () => dismiss());
    toast.appendChild(closeButton);

    region.appendChild(toast);

    if (sound) {
        play(NUDGE_SOUND_SRC, { volume: 0.5 });
    }

    let timeoutId = null;
    function dismiss() {
        if (timeoutId) clearTimeout(timeoutId);
        toast.remove();
    }

    if (duration > 0) {
        timeoutId = setTimeout(dismiss, duration);
    }

    return { id, dismiss };
}

/** Removes every toast currently on screen. */
export function dismissAll() {
    getRegion()
        .querySelectorAll(".toast")
        .forEach((toast) => toast.remove());
}
