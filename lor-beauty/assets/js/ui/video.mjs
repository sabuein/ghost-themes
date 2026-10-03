// assets/js/ui/video.mjs

// TikTok-style muted autoplay previews for posts tagged "video".

// Framework-free progressive enhancement: with no JS (or when the browser lacks

// IntersectionObserver, or the visitor prefers reduced motion / Save-Data) the

// poster image + play badge remain and each card is still a link to the post.

import { isTouchDevice } from "../utils/device.mjs";

const PLAYING_CLASS = "is-playing";

const READY_CLASS = "is-ready";

// Cap simultaneously-playing previews so scrolling stays light on mobile.

const MAX_ACTIVE = 3;

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const saveData = () =>
    Boolean(navigator.connection && navigator.connection.saveData);

const canHover = () => window.matchMedia("(hover: hover)").matches;

/**

 * Read the clip source + thumbnail out of the inert <template> that carries the

 * post's rendered Ghost video card.

 * @param {HTMLElement} card

 * @returns {{ src: string, poster: string } | null}

 */

function readClip(card) {
    const tpl = card.querySelector("template.video-card-clip");

    if (!tpl || !("content" in tpl)) return null;

    const video = tpl.content.querySelector("video");

    if (!video) return null;

    const src =
        video.getAttribute("src") ||
        video.querySelector("source")?.getAttribute("src") ||
        "";

    if (!src) return null;

    // Prefer the theme poster (the feature image already shown in the card).

    const posterImg = card.querySelector(".video-card-poster");

    let poster = posterImg?.currentSrc || posterImg?.getAttribute("src") || "";

    // Fall back to Ghost's auto-generated thumbnail, which lives in the <video>

    // inline style background (the poster attribute is a transparent spacer).

    if (!poster) {
        const style = video.getAttribute("style") || "";

        const match = style.match(/url\(['"]?([^'")]+)['"]?\)/i);

        if (match) poster = match[1];
    }

    return { src, poster };
}

/**

 * Build (once) the muted preview <video> for a card.

 * @param {HTMLElement} card

 * @returns {HTMLVideoElement | null}

 */

function ensureVideo(card) {
    const existing = card.querySelector(".video-card-video");

    if (existing) return existing;

    const clip = readClip(card);

    if (!clip) return null;

    const video = document.createElement("video");

    video.className = "video-card-video";

    video.muted = true;

    video.defaultMuted = true;

    video.loop = true;

    video.playsInline = true;

    video.setAttribute("playsinline", "");

    video.setAttribute("muted", "");

    video.preload = "none";

    video.tabIndex = -1;

    video.setAttribute("aria-hidden", "true");

    video.disablePictureInPicture = true;

    if (clip.poster) video.poster = clip.poster;

    video.src = clip.src;

    const media = card.querySelector(".video-card-media") || card;

    media.appendChild(video);

    card.classList.add(READY_CLASS);

    return video;
}

function play(card) {
    const video = ensureVideo(card);

    if (!video) return;

    const attempt = video.play();

    if (attempt && typeof attempt.then === "function") {
        attempt

            .then(() => card.classList.add(PLAYING_CLASS))

            .catch(() => {
                // Autoplay blocked (e.g. iOS Low Power Mode) — poster stays.
            });
    } else {
        card.classList.add(PLAYING_CLASS);
    }
}

function stop(card) {
    const video = card.querySelector(".video-card-video");

    card.classList.remove(PLAYING_CLASS);

    if (video) video.pause();
}

/**

 * Initialise muted autoplay previews for every .video-card in `root`.

 * @param {ParentNode} [root=document]

 */

export function initVideoPreviews(root = document) {
    const cards = Array.from(root.querySelectorAll(".video-card"));

    if (!cards.length) return;

    // Respect the visitor: leave the poster + badge, skip autoplay entirely.

    if (prefersReducedMotion() || saveData()) return;

    // Desktop with a real pointer: preview on hover / keyboard focus.

    if (canHover() && !isTouchDevice()) {
        cards.forEach((card) => {
            card.addEventListener("mouseenter", () => play(card));

            card.addEventListener("mouseleave", () => stop(card));

            card.addEventListener("focusin", () => play(card));

            card.addEventListener("focusout", () => stop(card));
        });

        return;
    }

    // Touch / no-hover: preview whichever cards sit nearest the viewport centre.

    if (!("IntersectionObserver" in window)) return;

    const visibility = new Map();

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                visibility.set(
                    entry.target,

                    entry.isIntersecting ? entry.intersectionRatio : 0,
                );
            });

            const active = new Set(
                [...visibility.entries()]

                    .filter(([, ratio]) => ratio > 0.6)

                    .sort((a, b) => b[1] - a[1])

                    .slice(0, MAX_ACTIVE)

                    .map(([card]) => card),
            );

            cards.forEach((card) =>
                active.has(card) ? play(card) : stop(card),
            );
        },

        { threshold: [0, 0.6, 0.9] },
    );

    cards.forEach((card) => observer.observe(card));
}