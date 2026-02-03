"use strict";

// App State
const AppState = {
  theme: localStorage.getItem("theme") || "light",
  cookiesAccepted: localStorage.getItem("cookiesAccepted") === "true",
};

// DOM Elements
const elements = {
    cookieConsent: document.getElementById("cookieConsent"),
  acceptCookies: document.getElementById("acceptCookies"),
  declineCookies: document.getElementById("declineCookies"),
};

const createButton = () => {
    // Create the scroll-to-top button element
    const scrollToTopBtn = document.createElement("button");
    scrollToTopBtn.id = "go-to-top";
    scrollToTopBtn.className = "scroll-to-top";
    scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
    scrollToTopBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<line x1="12" y1="19" x2="12" y2="5"></line>
<polyline points="5 12 12 5 19 12"></polyline>
</svg>
`;

    // Append the button to the body
    document.body.appendChild(scrollToTopBtn);
};

const initializeBackToTop = async () => {

    const scrollToTopBtn = document.getElementById("go-to-top");

    // Initially hide the button
    scrollToTopBtn.style.display = "none";

    // Show/hide the button based on scroll position
    window.addEventListener("scroll", function () {
        // Show button when user scrolls down 300px from the top
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = "flex";
            scrollToTopBtn.classList.add("visible");
        } else {
            scrollToTopBtn.classList.remove("visible");
            // Use setTimeout to allow the fade-out animation to complete
            setTimeout(() => {
                if (!scrollToTopBtn.classList.contains("visible")) {
                    scrollToTopBtn.style.display = "none";
                }
            }, 300); // Match this to your CSS transition time
        }
    });

    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener("click", function () {
        // For smooth scrolling
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
};

let lastContainerWidth = 0;

// Calculate how many sets of logos we need to ensure continuous scrolling
const setupInfiniteScroll = async (logoTrack, container) => {
    if (!logoTrack || !container) return undefined;

    const containerWidth = container.offsetWidth;
    // Skip if width hasn't changed meaningfully
    if (Math.abs(containerWidth - lastContainerWidth) < 20) return;
    lastContainerWidth = containerWidth;

    // Save original items before DOM is cleared
    const originalItems = Array.from(logoTrack.children);

    // Measure widths before clearing content
    const originalTrackWidth = logoTrack.offsetWidth;

    // Clear track and re-append original items
    logoTrack.innerHTML = '';
    originalItems.forEach(item => logoTrack.appendChild(item));

    // Determine how many duplicates are needed (max 3 sets)
    const setsNeeded = Math.min(2, Math.ceil((containerWidth * 1.15) / originalTrackWidth) + 1);

    // Clone using a DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < setsNeeded; i++) {
        originalItems.forEach(item => {
            fragment.appendChild(item.cloneNode(true));
        });
    }
    logoTrack.appendChild(fragment);

    // Set scroll animation duration based on total width
    const totalScrollWidth = logoTrack.scrollWidth;
    const animationDuration = (totalScrollWidth / 100) + "s"; // Adjust divisor for speed
    logoTrack.style.setProperty("--scroll-duration", animationDuration);

    // Add CSS class to trigger animation
    logoTrack.classList.add("scrolling");

    // Optional: pause on hover
    logoTrack.addEventListener("mouseenter", () => {
        logoTrack.style.animationPlayState = "paused";
    });
    logoTrack.addEventListener("mouseleave", () => {
        logoTrack.style.animationPlayState = "running";
    });
};

// Use a debounce function to delay execution until the user has stopped resizing
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

const initializeInfiniteScroll = async () => {

    const logoTrack = document.getElementById("logoTrack");
    const container = document.getElementById("logoCarousel");

    if (!!logoTrack && !!container) {
        // Initial setup
        await setupInfiniteScroll(logoTrack, container);

        // Recalculate on window resize
        // window.addEventListener("resize", debounce(setupInfiniteScroll, 300));

        // Instead of window.resize, use ResizeObserver for element-specific monitoring with better performance:
        const observer = new ResizeObserver(debounce(() => {
            setupInfiniteScroll(logoTrack, container);
        }, 300));

        observer.observe(container);
    } return undefined;
};

// Animate elements when they come into view
const animateOnScroll = async (elements) => {
    
    elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.style.opacity = "1";
        }
    });
};

const initializeAnimateOnScroll = async () => {

    // Set initial state for animated elements
    const elementsToAnimate = document.querySelectorAll(".highlight-card");
    if (!elementsToAnimate.length) return undefined;

    elementsToAnimate.forEach(element => element.style.opacity = "0");

    // Run once on page load
    await animateOnScroll(elementsToAnimate);

    // Run animation on scroll
    window.addEventListener("scroll", () => animateOnScroll(elementsToAnimate));
};

const initializeDetails = () => {
    const summaries = document.querySelectorAll('summary');
    summaries.forEach((summary) => {
    summary.addEventListener("click", closeOpenedDetails);
    });
};

const closeOpenedDetails = () => {
  summaries.forEach((summary) => {
    let detail = summary.parentNode;
      if (detail != this.parentNode) {
        detail.removeAttribute('open');
      }
    });
};

// Cookie Management
class CookieManager {
  constructor() {
    this.init();
  }

  init() {
    if (!AppState.cookiesAccepted) {
      this.showCookieConsent();
    }

    elements.acceptCookies.addEventListener("click", () => this.acceptCookies());
    elements.declineCookies.addEventListener("click", () => this.declineCookies());
  }

  showCookieConsent() {
    elements.cookieConsent.classList.remove("hidden");
  }

  acceptCookies() {
    AppState.cookiesAccepted = true;
    window.localStorage.setItem("cookiesAccepted", "true");
    elements.cookieConsent.classList.add("hidden");
    this.initAnalytics();
  }

  declineCookies() {
    elements.cookieConsent.classList.add("hidden");
  }

  initAnalytics() {
    // Initialize analytics only after consent
    console.log("Analytics initialized");
  }
}

export { initializeBackToTop, initializeInfiniteScroll, initializeAnimateOnScroll, CookieManager };
