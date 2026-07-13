// Note: real offline queue replay belongs in SW + IndexedDB. This gives the integration hook now.

const SYNC_TAG = "lor-beauty-sync";

export async function registerBackgroundSync(registration) {
    if (!registration || !("sync" in registration)) return false;
    try {
        await registration.sync.register(SYNC_TAG);
        return true;
    } catch (error) {
        console.warn("[PWA] Background sync not available:", error);
        return false;
    }
}

export function getSyncTag() {
    return SYNC_TAG;
}