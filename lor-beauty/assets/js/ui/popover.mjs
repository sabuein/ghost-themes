// assets/js/ui/popover.mjs
//
// Generic, reusable logic for every native popover in the theme (the
// mobile nav and the account menu today; anything with a `popover`
// attribute later). Same shape as ui/dialog.mjs: one shared init call,
// no bespoke JS needed per popover you add.
//
// The browser already handles almost everything on its own for
// popover="auto" (what every popover in this theme uses):
//   - Opening one closes any other open auto popover automatically.
//   - Clicking outside, or pressing Escape, closes it ("light dismiss").
//   - Focus handling on open/close.
// None of that needs reimplementing here. What's left is the one thing
// native auto-popovers don't do: close themselves when you click a *link*
// inside them (a click inside a popover doesn't count as "outside," so
// without this, tapping a nav link leaves the mobile menu sitting open
// while the new page loads).
//
// ---------------------------------------------------------------------
// USAGE
// ---------------------------------------------------------------------
// Call initPopovers() once (from application.mjs). Every `[popover]`
// element already in the page — now or added later — gets link-auto-close
// wired up automatically. No markup changes needed beyond what
// popovertarget already requires:
//
//   <button popovertarget="primary-nav">Menu</button>
//   <nav id="primary-nav" popover="auto">
//     <a href="/shop/">Shop</a>  <!-- clicking this now closes the popover -->
//   </nav>
//
// Every open/close also fires a `lor:popover-open` / `lor:popover-close`
// CustomEvent on the popover element (bubbles) — the same naming
// convention as ui/dialog.mjs's `lor:dialog-open`/`lor:dialog-close`, so
// other code (sound, analytics) can hook into either the same way:
//
//   document.addEventListener('lor:popover-open', (event) => {
//     console.log('opened:', event.target.id);
//   });
//
// openPopover()/closePopover() are also exported for opening one from
// your own JS (e.g. programmatically after a fetch), mirroring
// dialog.mjs's openDialog()/closeDialog().

export function openPopover(id) {
    const popover = document.getElementById(id);
    if (popover?.showPopover && !popover.matches(":popover-open")) {
        popover.showPopover();
    }
}

export function closePopover(id) {
    const popover = document.getElementById(id);
    if (popover?.hidePopover && popover.matches(":popover-open")) {
        popover.hidePopover();
    }
}

function wireLinkAutoClose(popover) {
    popover.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");
        if (link) {
            popover.hidePopover();
        }
    });
}

function wireToggleEventBridge(popover) {
    // The native `toggle` event fires after a popover opens or closes,
    // whether that happened via popovertarget, showPopover()/hidePopover(),
    // Escape, or light-dismiss — one listener here covers all of them.
    popover.addEventListener("toggle", (event) => {
        const eventName =
            event.newState === "open"
                ? "lor:popover-open"
                : "lor:popover-close";
        popover.dispatchEvent(new CustomEvent(eventName, { bubbles: true }));
    });
}

/**
 * Wires up every `[popover]` element under `root`. Safe to call more than
 * once on overlapping content — already-wired elements are tracked and
 * skipped.
 *
 * @param {ParentNode} [root]
 */
export function initPopovers(root = document) {
    root.querySelectorAll("[popover]").forEach((popover) => {
        if (popover.dataset.popoverWired) return;
        popover.dataset.popoverWired = "true";

        wireLinkAutoClose(popover);
        wireToggleEventBridge(popover);
    });
}
