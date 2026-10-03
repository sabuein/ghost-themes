// assets/js/ui/back-to-top.mjs
//
// Shows the back-to-top link once the reader has scrolled past one
// viewport height. The link's href="#main-content" is a no-JS fallback
// (native anchor jump, adds a URL hash); with JS enabled we intercept
// the click and scroll/focus manually so the URL stays clean.

export function initBackToTop() {
    const button = document.getElementById("back-to-top");
    if (!button) return;

    let ticking = false;

    function updateVisibility() {
        button.classList.toggle("is-visible", window.scrollY > window.innerHeight);
        ticking = false;
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateVisibility);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateVisibility();

    button.addEventListener("click", (event) => {
        event.preventDefault(); // stop the native #main-content jump (and its URL hash)

        const target = document.getElementById("main-content");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        target?.focus({ preventScroll: true });
    });
}