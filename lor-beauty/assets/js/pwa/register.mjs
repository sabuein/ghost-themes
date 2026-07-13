import { showToast } from "../ui/toast.mjs";

export async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return null;

    try {
        const registration = await navigator.serviceWorker.register(
            "/service-worker.mjs",
            {
                scope: "/",
            },
        );

        registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
                // New SW installed while current page is controlled => update available
                if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                ) {
                    showToast("A new version is available.", {
                        duration: 0,
                        action: {
                            label: "Refresh Now",
                            onClick: () => {
                                newWorker.postMessage({ type: "SKIP_WAITING" });
                            },
                        },
                    });
                }
            });
        });

        // Reload once the new SW takes control
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });

        return registration;
    } catch (error) {
        console.error("[PWA] SW registration failed:", error);
        return null;
    }
}