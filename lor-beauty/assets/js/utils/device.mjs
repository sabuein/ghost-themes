// assets/js/utils/device.mjs
// Monitors network connectivity and basic device/hardware checks.
// Framework-free: consumers subscribe with a plain callback and get an
// unsubscribe function back, instead of a React hook.

export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
    );
}

export function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function isOnline() {
    return navigator.onLine;
}

/**
 * Subscribes to connectivity changes.
 * @param {(online: boolean) => void} callback
 * @returns {() => void} unsubscribe
 */
export function onConnectivityChange(callback) {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
    };
}

const MOBILE_BREAKPOINT = 768;

/**
 * Subscribes to viewport-width-based "is this a mobile layout" changes.
 * Fires once immediately with the current value, then on every change.
 * @param {(isMobileWidth: boolean) => void} callback
 * @returns {() => void} unsubscribe
 */
export function onViewportChange(callback) {
    const mediaQuery = window.matchMedia(
        `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );
    const handleChange = () => callback(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    handleChange();

    return () => mediaQuery.removeEventListener("change", handleChange);
}
