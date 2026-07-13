// Handles the service worker registration lifecycle and triggers updates when a new version of the app is deployed.

// Handle Updates Gracefully: When you update your service worker, register.js should show a snackbar or toast saying: "A new version is available. [Refresh Now]" rather than force-reloading on the user unexpectedly.