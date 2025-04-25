"use strict";

/** Detecting user inactivity by monitoring user interactions like mouse movements, keyboard activity, or clicks, and triggering an action after a set period of inactivity. */
const basicInactivityTimer = () => {
    let inactivityTime = 300000; // 5 minutes in milliseconds
    let inactivityTimer;

    // Reset the timer on user activity
    const resetTimer = () => {
        clearTimeout(inactivityTimer);
        startInactivityTimer();
    };

    // Start the inactivity timer
    const startInactivityTimer = () => {
        inactivityTimer = setTimeout(() => {
            console.log("User is inactive.");
            // Add your logic for inactivity (e.g., log out, show a warning, etc.)
        }, inactivityTime);
    };

    // Listen for user activity events
    ["mousemove", "keydown", "mousedown", "touchstart"].forEach((event) => {
        document.addEventListener(event, resetTimer, true);
    });

    // Start the timer on page load
    startInactivityTimer();
};

/** Monitor whether the user has switched tabs or minimized the browser using the Page Visibility API. */
const monitorUserVisibility = () => {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            console.log("User left the page");
            // Handle inactivity logic
        } else {
            console.log("User returned to the page");
            // Reset inactivity timer if needed
        }
        
        
    });
};

const activateDialogElement = () => {
    const dialog = document.querySelector("dialog");
    const showButton = document.querySelector("dialog + button");
    const closeButton = document.querySelector("dialog button");

    // "Show the dialog" button opens the dialog modally
    showButton.addEventListener("click", () => {
        dialog.showModal();
    });

    // "Close" button closes the dialog
    closeButton.addEventListener("click", (event) => {
        event.preventDefault();
        dialog.close();
    });
};

export { basicInactivityTimer, monitorUserVisibility, activateDialogElement };