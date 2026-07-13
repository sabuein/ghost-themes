// assets/js/utils/audio.mjs
//
// Plays short one-shot UI sound effects (an add-to-cart chime, a
// notification ping, that kind of thing) using plain HTMLAudioElement
// rather than the full Web Audio API.
//
// Why not the Web Audio API? It's the right tool when you need to mix
// multiple sounds together, apply effects/filters, or do sample-accurate
// timing — none of which applies here. For "play this short clip when X
// happens," a cached <audio> element is simpler, needs no AudioContext
// setup/teardown, and does the job in a handful of lines. If this theme
// later grows real audio needs (a game, a synth, live mixing), that's a
// separate module built on the Web Audio API — this one stays small.
//
// ---------------------------------------------------------------------
// AUTOPLAY POLICY — read this before relying on it for anything important
// ---------------------------------------------------------------------
// Browsers block audio.play() from firing until the visitor has interacted
// with the page at least once (a click, a tap, a keypress). Calling play()
// before that returns a rejected Promise — this module swallows that
// rejection rather than throwing, since "audio was silently blocked" is
// expected, ordinary behavior, not a bug to surface to the visitor.
//
// If you know a sound needs to play reliably right after the *first*
// interaction (e.g. a click on a "mute/unmute" button that immediately
// plays a confirmation chime), that click IS the qualifying interaction,
// so it'll work fine — the restriction only bites sounds that try to
// autoplay before any interaction has happened at all.
//
// ---------------------------------------------------------------------
// USAGE
// ---------------------------------------------------------------------
//   import { preload, play, setMuted, isMuted } from '../utils/audio.mjs';
//
//   // Warm the cache early so there's no delay on first play (optional —
//   // play() will lazily create+cache the element anyway if you skip this).
//   preload('/assets/audio/add-to-cart.mp3');
//
//   addToCartButton.addEventListener('click', () => {
//     play('/assets/audio/add-to-cart.mp3');
//     addToCart(product);
//   });
//
//   muteButton.addEventListener('click', () => {
//     setMuted(!isMuted());
//     muteButton.setAttribute('aria-pressed', String(isMuted()));
//   });
//
//   // A quieter variant, and a looping ambient sound:
//   play('/assets/audio/notification.mp3', { volume: 0.4 });
//   play('/assets/audio/ambient-loop.mp3', { loop: true });
//   stop('/assets/audio/ambient-loop.mp3'); // later, to stop the loop

const MUTED_KEY = "lor-audio-muted";
const VOLUME_KEY = "lor-audio-volume";

/** @type {Map<string, HTMLAudioElement>} */
const cache = new Map();

// --- Mute state -------------------------------------------------------

export function isMuted() {
    return localStorage.getItem(MUTED_KEY) === "true";
}

export function setMuted(muted) {
    localStorage.setItem(MUTED_KEY, String(Boolean(muted)));
}

export function toggleMuted() {
    const next = !isMuted();
    setMuted(next);
    return next;
}

// --- Global volume (0–1), applied on top of each play() call's volume -

export function getVolume() {
    const stored = Number.parseFloat(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(stored) ? clamp(stored, 0, 1) : 1;
}

export function setVolume(volume) {
    localStorage.setItem(VOLUME_KEY, String(clamp(volume, 0, 1)));
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

// --- Playback -----------------------------------------------------------

function getAudio(src) {
    if (!cache.has(src)) {
        const audio = new Audio(src);
        audio.preload = "auto";
        cache.set(src, audio);
    }
    return cache.get(src);
}

/** Creates and caches the <audio> element for `src` without playing it. */
export function preload(src) {
    getAudio(src);
}

/** Convenience for warming several sounds at once, e.g. on app init. */
export function preloadAll(sources) {
    sources.forEach(preload);
}

/**
 * Plays a cached (or newly created) audio clip from the start.
 *
 * @param {string} src
 * @param {{ volume?: number, loop?: boolean }} [options]
 *   volume: 0–1, multiplied against the visitor's global volume setting.
 *   loop: keep repeating until stop(src) is called.
 */
export function play(src, options = {}) {
    if (isMuted()) return;

    const { volume = 1, loop = false } = options;
    const audio = getAudio(src);

    audio.loop = loop;
    audio.volume = clamp(volume, 0, 1) * getVolume();
    audio.currentTime = 0;

    audio.play().catch(() => {
        // Blocked by the browser's autoplay policy (no user interaction yet) —
        // expected in normal use, not worth surfacing as an error.
    });
}

/** Pauses a clip and resets it to the start. No-op if it isn't playing. */
export function stop(src) {
    const audio = cache.get(src);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
}

/** Pauses every currently-cached clip (e.g. when the tab loses focus). */
export function stopAll() {
    cache.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
    });
}
