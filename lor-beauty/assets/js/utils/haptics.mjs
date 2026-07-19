// assets/js/utils/haptics.mjs
//
// Thin wrapper around the browser's Vibration API (navigator.vibrate),
// used for short tactile "bumps" on interactions; tapping a button,
// adding to cart, a form error, that kind of thing.
//
// ---------------------------------------------------------------------
// PLATFORM SUPPORT; read this before relying on it for anything important
// ---------------------------------------------------------------------
// - Android (Chrome, Firefox, Samsung Internet): supported.
// - iOS Safari: NOT supported. Apple has never implemented the Vibration
//   API, on iPhone or iPad, in any browser (all iOS browsers use Safari's
//   engine). Calls here will just silently no-op there; isHapticsSupported()
//   will return false, and every vibrate* function becomes a harmless noop.
// - Desktop browsers: technically may report support but there's no
//   hardware to vibrate, so nothing happens either way.
// Because of this, haptics should always be a *bonus*, never something a
// feature depends on. Never gate actual functionality behind whether
// vibration fired.
//
// Most browsers also only honor navigator.vibrate() when it's called
// synchronously inside a real user gesture (a click/tap handler). Calling
// it from a setTimeout, a fetch().then(), or on page load will usually be
// silently ignored; that's the browser protecting people from buzzing
// phones they didn't ask for, not a bug here.
//
// ---------------------------------------------------------------------
// USAGE
// ---------------------------------------------------------------------
//   import { vibrateLight, vibrateSuccess } from "../utils/haptics.mjs";
//
//   addToCartButton.addEventListener("click", () => {
//     vibrateLight();       // little "tap acknowledged" bump
//     addToCart(product);
//   });
//
//   form.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const ok = await submitForm();
//     ok ? vibrateSuccess() : vibrateError();
//   });
//
// If you just want a custom one-off pattern instead of the presets below,
// use vibrate() directly:
//
//   vibrate(200);            // one 200ms buzz
//   vibrate([100, 50, 100]); // buzz 100ms, pause 50ms, buzz 100ms
//
// All durations/pauses in a pattern array are milliseconds, alternating
// vibrate/pause/vibrate/pause...

const STORAGE_KEY = "lor-haptics-enabled";

/** Whether this browser/device exposes the Vibration API at all. */
export function isHapticsSupported() {
    return "vibrate" in navigator;
}

/**
 * Whether the visitor has haptics turned on. Defaults to true — call
 * setHapticsEnabled(false) to offer an opt-out (e.g. from a settings menu),
 * same idea as utils/audio.mjs's mute toggle.
 */
export function isHapticsEnabled() {
    return safeStorageGet(STORAGE_KEY) !== "false";
}

export function setHapticsEnabled(enabled) {
    safeStorageSet(STORAGE_KEY, String(Boolean(enabled)));
}

/**
 * Low-level entry point — fires a raw pattern if haptics are supported
 * and enabled. Prefer the named presets below (vibrateLight, vibrateError,
 * etc.) for anything UI-related; reach for this directly only for a
 * genuinely custom pattern.
 *
 * @param {number | number[]} pattern - ms, or an alternating on/off pattern.
 * @returns {boolean} true if the browser accepted the request (NOT a
 *   guarantee the device actually buzzed — the API doesn't provide one).
 */
export function vibrate(pattern) {
    if (!isHapticsSupported() || !isHapticsEnabled()) return false;
    return navigator.vibrate(pattern);
}

/** Stops any vibration currently in progress. */
export function cancelVibration() {
    if (!isHapticsSupported()) return;
    navigator.vibrate(0);
}

// ---------------------------------------------------------------------
// Presets, roughly modeled on iOS's UIFeedbackGenerator styles — even
// though iOS Safari can't play them, this keeps the vocabulary consistent
// for anyone who's worked with native haptics before, and gives Android
// visitors a well-tuned baseline instead of everyone reaching for random
// numbers at each call site.
// ---------------------------------------------------------------------

/** Smallest possible bump — routine taps: selecting a filter, a toggle. */
export function vibrateLight() {
    return vibrate(10);
}

/** A bit more present — confirming something happened: added to cart. */
export function vibrateMedium() {
    return vibrate(20);
}

/** Strongest single bump — reserved for rarer, more significant moments. */
export function vibrateHeavy() {
    return vibrate(30);
}

/** For scrubbing through options (a picker, a slider) — same weight as light. */
export function vibrateSelection() {
    return vibrate(10);
}

/** Double tap — positive outcome: form submitted, payment succeeded. */
export function vibrateSuccess() {
    return vibrate([15, 60, 15]);
}

/** Three shorter pulses — needs attention, but nothing is broken. */
export function vibrateWarning() {
    return vibrate([20, 50, 20, 50, 20]);
}

/** Longer, more insistent pattern — something failed. Use sparingly. */
export function vibrateError() {
    return vibrate([30, 50, 30, 50, 30]);
}

// ---------- Utils ----------

function safeStorageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // ignore storage errors (privacy mode/quota)
    }
}