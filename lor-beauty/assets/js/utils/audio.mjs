const MUTED_KEY = "lor-audio-muted";
const VOLUME_KEY = "lor-audio-volume";
const BACKEND_KEY = "lor-audio-backend";
const NUDGE_SRC_KEY = "lor-audio-nudge-src";

// Allowed: "file" | "tone" | "system" | "off"
const DEFAULT_BACKEND = "tone";
const DEFAULT_NUDGE_SRC = "/assets/audio/nudge.mp3";

/** @type {Map<string, HTMLAudioElement>} */
const cache = new Map();

/** @typedef {"file" | "tone" | "system" | "off"} AudioBackend */

// ---------- State ----------

export function isMuted() {
    return safeStorageGet(MUTED_KEY) === "true";
}

export function setMuted(muted) {
    safeStorageSet(MUTED_KEY, String(Boolean(muted)));
}

export function toggleMuted() {
    const next = !isMuted();
    setMuted(next);
    return next;
}

export function getVolume() {
    const stored = Number.parseFloat(safeStorageGet(VOLUME_KEY));
    return Number.isFinite(stored) ? clamp(stored, 0, 1) : 1;
}

export function setVolume(volume) {
    safeStorageSet(VOLUME_KEY, String(clamp(volume, 0, 1)));
}

export function getBackend() {
    const stored = safeStorageGet(BACKEND_KEY);
    if (
        stored === "file" ||
        stored === "tone" ||
        stored === "system" ||
        stored === "off"
    ) {
        return stored;
    }
    return DEFAULT_BACKEND;
}

/** @param {AudioBackend} backend */
export function setBackend(backend) {
    if (!["file", "tone", "system", "off"].includes(backend)) return;
    safeStorageSet(BACKEND_KEY, backend);
}

export function getNudgeSrc() {
    return safeStorageGet(NUDGE_SRC_KEY) || DEFAULT_NUDGE_SRC;
}

export function setNudgeSrc(src) {
    if (!src || typeof src !== "string") return;
    safeStorageSet(NUDGE_SRC_KEY, src);
}

// ---------- File backend helpers ----------

function getAudio(src) {
    if (!cache.has(src)) {
        const audio = new Audio(src);
        audio.preload = "auto";
        cache.set(src, audio);
    }
    return cache.get(src);
}

export function preload(src) {
    getAudio(src);
}

export function preloadAll(sources) {
    sources.forEach(preload);
}

export function play(src, options = {}) {
    if (isMuted()) return;

    const { volume = 1, loop = false } = options;
    const audio = getAudio(src);

    audio.loop = loop;
    audio.volume = clamp(volume, 0, 1) * getVolume();
    audio.currentTime = 0;

    audio.play().catch(() => {
        // Autoplay policy block or transient playback issue.
    });
}

export function stop(src) {
    const audio = cache.get(src);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
}

export function stopAll() {
    cache.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
    });
}

// ---------- Nudge API (toast can call this only) ----------

/**
 * Play a short "nudge" notification according to selected backend.
 * @param {{ backend?: AudioBackend, title?: string, body?: string, volume?: number, nudgeSrc?: string }} [options]
 */
export async function playNudge(options = {}) {
    if (isMuted()) return false;

    const backend = options.backend || getBackend();
    const volume = clamp(options.volume ?? 1, 0, 1);

    if (backend === "off") return false;

    if (backend === "file") {
        play(options.nudgeSrc || getNudgeSrc(), { volume });
        return true;
    }

    if (backend === "tone") {
        return playToneNudge({ volume });
    }

    if (backend === "system") {
        // Try system notification sound first; fallback to tone.
        const ok = await playSystemNudge({
            title: options.title || "Nudge Alert",
            body: options.body || "You have a new update.",
        });
        if (ok) return true;
        return playToneNudge({ volume });
    }

    // Unknown backend => safe fallback
    return playToneNudge({ volume });
}

// ---------- Backend implementations ----------

function playToneNudge({ volume = 1 } = {}) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    try {
        const audioCtx = new AudioCtx();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);

        const scaled = clamp(volume, 0, 1) * getVolume();
        gainNode.gain.setValueAtTime(
            Math.max(0.0001, 0.5 * scaled),
            audioCtx.currentTime,
        );
        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.3,
        );

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);

        oscillator.onended = () => {
            audioCtx.close().catch(() => {});
        };

        return true;
    } catch {
        return false;
    }
}

async function playSystemNudge({ title, body }) {
    if (!("Notification" in window)) return false;

    try {
        if (Notification.permission === "granted") {
            new Notification(title, { body, silent: false });
            return true;
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                new Notification(title, { body, silent: false });
                return true;
            }
        }
    } catch {
        // Ignore and let caller fallback
    }

    return false;
}

// ---------- Utils ----------

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

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
