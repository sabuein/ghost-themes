"use strict";

const loadTheme = async () => {
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Get saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || (prefersDarkMode ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", initialTheme);
    return initialTheme;
};


const initializeTheme = async () => {
    const initialTheme = await loadTheme();
    const themeToggle = document.getElementById("theme-toggle-btn");
    const moonIcon = document.querySelector(".moon-icon");
    const sunIcon = document.querySelector(".sun-icon");

    if (initialTheme === "light") {
        moonIcon.classList.remove("hidden");
        sunIcon.classList.add("hidden");
    }

    // Toggle theme
    themeToggle.addEventListener("click", function () {

        // Check for saved theme preference
        if (localStorage.getItem("theme") === "light") {
            localStorage.setItem("theme", "dark");
            document.documentElement.setAttribute("data-theme", "dark");
            moonIcon.classList.add("hidden");
            sunIcon.classList.remove("hidden");
        } else {
            localStorage.setItem("theme", "light");
            document.documentElement.setAttribute("data-theme", "light");
            sunIcon.classList.add("hidden");
            moonIcon.classList.remove("hidden");
        }
    });

    return "Theme initialised successfully.";
};

export { initializeTheme as default };