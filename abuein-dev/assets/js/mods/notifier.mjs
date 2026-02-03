"use strict";

/**
 * Notification system
 */

/**
 * Show notification with different status types
 * @param {string} message - The notification message
 * @param {string} status - Status type (success, error, warning, info)
 * @param {int} duration - Duration in milliseconds
 */
const showNotification = async (message, status = "success", duration = 5000) => {
    const notifier = document.getElementById("notifier");
    const notificationText = notifier.querySelector("p");

    // Set the message
    notificationText.textContent = message;

    // Remove all status classes first
    notifier.classList.remove("success", "error", "warning", "info");

    // Add the appropriate status class
    notifier.classList.add(status);

    // Show the notification
    notifier.classList.add("show");

    // Hide notification after duration
    setTimeout(() => notifier.classList.remove("show"), duration);
};

const closeNotification = async () => {
    // Close notification button
    const closeNotification = document.getElementById("close-notification-now");
    if (closeNotification) {
        closeNotification.addEventListener("click", () => {
            document.getElementById("notifier").classList.remove("show");
        });
    }
};

const initializeNotifier = async () => {
    await closeNotification()
};

export { initializeNotifier as default, showNotification };