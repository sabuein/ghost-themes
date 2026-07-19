// assets/js/ui/dialog.mjs
//
// Generic, reusable logic for every native <dialog> in the theme — one
// shared init call handles backdrop-click-to-close and declarative
// open/close triggers for *any* dialog on the page, so adding a new dialog
// never needs its own bespoke JS. On top of that, alertDialog()/
// confirmDialog() give you drop-in, Promise-based replacements for
// window.alert()/window.confirm() that don't freeze the page.
//
// The browser already handles focus trapping and Escape-to-close for
// modal dialogs (opened via showModal()) — we only need to add what it
// doesn't give us for free.
//
// ---------------------------------------------------------------------
// PART 1 — declarative wiring for dialogs you author in HTML
// ---------------------------------------------------------------------
// Call initDialogs() once (from application.mjs) and every <dialog> already
// in the page — now or added later — gets:
//
//   1. Click-outside-to-close (clicking the backdrop area).
//   2. Any element with `data-dialog-open="some-id"` opens #some-id on click.
//   3. Any element *inside* a dialog with `data-dialog-close` closes it
//      (for a custom "×" button, in addition to Escape/backdrop).
//
// Example — no JS needed beyond the one initDialogs() call:
//
//   <button data-dialog-open="newsletter-dialog">Subscribe</button>
//
//   <dialog id="newsletter-dialog">
//     <button data-dialog-close aria-label="Close">×</button>
//     <h2>Join the list</h2>
//     ...
//   </dialog>
//
// openDialog('newsletter-dialog') / closeDialog('newsletter-dialog') are
// also exported directly, for opening one from your own JS (e.g. after a
// fetch completes).
//
// Every open/close additionally fires a `lor:dialog-open` / `lor:dialog-close`
// CustomEvent on the <dialog> element (bubbles), so other code — sound,
// analytics, pausing a background video — can hook in without touching
// this file:
//
//   document.addEventListener('lor:dialog-open', (event) => {
//     console.log('opened:', event.target.id);
//   });
//
// ---------------------------------------------------------------------
// PART 2 — alertDialog() / confirmDialog(): drop-in alert()/confirm()
// ---------------------------------------------------------------------
// These build a temporary <dialog> on the fly, show it modally, resolve a
// Promise based on what the visitor clicks, then remove themselves from
// the DOM. Unlike the real alert()/confirm(), they don't freeze the whole
// page (JS keeps running; only the calling `await` pauses), and they're
// fully styleable since it's your own markup, not the browser's.
//
//   import { alertDialog, confirmDialog } from '../ui/dialog.mjs';
//
//   await alertDialog('Your changes have been saved.');
//
//   const shouldDelete = await confirmDialog('Delete this item?', {
//     confirmLabel: 'Delete',
//     cancelLabel: 'Keep it',
//   });
//   if (shouldDelete) removeItem(item);

// --- Part 1: declarative wiring -----------------------------------------

export function openDialog(id) {
    const dialog = document.getElementById(id);
    if (dialog instanceof HTMLDialogElement && !dialog.open) {
        dialog.showModal();
        dialog.dispatchEvent(
            new CustomEvent("lor:dialog-open", { bubbles: true }),
        );
    }
}

export function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (dialog instanceof HTMLDialogElement && dialog.open) {
        dialog.close();
    }
}

function wireBackdropClose(dialog) {
    dialog.addEventListener("click", (event) => {
        // A click landing on the <dialog> element itself (not its content)
        // means the visitor clicked the backdrop.
        if (event.target === dialog) {
            dialog.close();
        }
    });
}

function wireCloseButtons(dialog) {
    dialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
        button.addEventListener("click", () => dialog.close());
    });
}

function wireNativeCloseEvent(dialog) {
    // Covers every way a dialog can close — Escape key, backdrop click,
    // data-dialog-close, or dialog.close() called directly from your own
    // code — with one listener instead of duplicating this event at each
    // closing mechanism.
    dialog.addEventListener("close", () => {
        dialog.dispatchEvent(
            new CustomEvent("lor:dialog-close", { bubbles: true }),
        );
    });
}

/**
 * Wires up every <dialog> under `root`, plus every `[data-dialog-open]`
 * trigger under `root`. Safe to call more than once on overlapping
 * content (e.g. after injecting new markup) — already-wired elements are
 * tracked and skipped.
 *
 * @param {ParentNode} [root]
 */
export function initDialogs(root = document) {
    root.querySelectorAll("dialog").forEach((dialog) => {
        if (dialog.dataset.dialogWired) return;
        dialog.dataset.dialogWired = "true";

        wireBackdropClose(dialog);
        wireCloseButtons(dialog);
        wireNativeCloseEvent(dialog);
    });

    root.querySelectorAll("[data-dialog-open]").forEach((trigger) => {
        if (trigger.dataset.dialogTriggerWired) return;
        trigger.dataset.dialogTriggerWired = "true";

        trigger.addEventListener("click", () => {
            const id = trigger.dataset.dialogOpen;
            const dialog = document.getElementById(id);
            if (!(dialog instanceof HTMLDialogElement)) return;

            let payload = null;
            try {
                payload = trigger.dataset.dialogPayload
                    ? JSON.parse(trigger.dataset.dialogPayload)
                    : null;
            } catch {
                payload = null;
            }

            dialog.dispatchEvent(
                new CustomEvent("lor:dialog-before-open", {
                    bubbles: true,
                    detail: { trigger, payload },
                }),
            );

            openDialog(id);
        });
    });
}

// --- Part 2: alert()/confirm() replacements ------------------------------

let transientCounter = 0;

function buildTransientDialog({ message, buttons }) {
    const dialog = document.createElement("dialog");
    dialog.id = `lor-transient-dialog-${++transientCounter}`;
    dialog.className = "lor-dialog lor-dialog-transient";

    const text = document.createElement("p");
    text.id = `${dialog.id}-message`;
    text.className = "lor-dialog-message";
    text.textContent = message;
    dialog.setAttribute("aria-labelledby", text.id);
    dialog.appendChild(text);

    const actions = document.createElement("div");
    actions.className = "lor-dialog-actions";

    buttons.forEach(({ label, value, autofocus }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        if (autofocus) button.autofocus = true;
        button.addEventListener("click", () => dialog.close(String(value)));
        actions.appendChild(button);
    });

    dialog.appendChild(actions);
    document.body.appendChild(dialog);

    return { dialog };
}

/**
 * Promise-based replacement for window.alert() — a single acknowledgement
 * button. Resolves once the visitor dismisses it (button, Escape, or
 * backdrop click all count as acknowledged).
 *
 * @param {string} message
 * @param {{ okLabel?: string }} [options]
 * @returns {Promise<void>}
 */
export function alertDialog(message, options = {}) {
    const { okLabel = "OK" } = options;

    return new Promise((resolve) => {
        const { dialog } = buildTransientDialog({
            message,
            buttons: [{ label: okLabel, value: "ok", autofocus: true }],
        });

        wireBackdropClose(dialog);
        dialog.addEventListener("close", () => {
            dialog.remove();
            resolve();
        });

        dialog.showModal();
    });
}

/**
 * Promise-based replacement for window.confirm(). Resolves `true` if the
 * visitor confirmed, `false` for cancel, backdrop click, or Escape.
 *
 * @param {string} message
 * @param {{ confirmLabel?: string, cancelLabel?: string }} [options]
 * @returns {Promise<boolean>}
 */
export function confirmDialog(message, options = {}) {
    const { confirmLabel = "Confirm", cancelLabel = "Cancel" } = options;

    return new Promise((resolve) => {
        const { dialog } = buildTransientDialog({
            message,
            buttons: [
                { label: cancelLabel, value: "cancel" },
                { label: confirmLabel, value: "confirm", autofocus: true },
            ],
        });

        wireBackdropClose(dialog);
        dialog.addEventListener("close", () => {
            const confirmed = dialog.returnValue === "confirm";
            dialog.remove();
            resolve(confirmed);
        });

        dialog.showModal();
    });
}
