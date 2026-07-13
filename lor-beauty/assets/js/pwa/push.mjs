export async function requestNotificationPermission() {
    if (!("Notification" in window)) return "unsupported";
    const permission = await Notification.requestPermission();
    return permission; // granted | denied | default
}

/**
 * Placeholder: pass a real VAPID public key + backend endpoint later.
 */
export async function subscribeToPush(registration, applicationServerKey) {
    if (!registration || !("PushManager" in window)) return null;
    if (!applicationServerKey) return null;

    try {
        const existing = await registration.pushManager.getSubscription();
        if (existing) return existing;

        return await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
        });
    } catch (error) {
        console.error("[PWA] Push subscribe failed:", error);
        return null;
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((ch) => ch.charCodeAt(0)));
}