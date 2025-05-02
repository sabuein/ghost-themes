"use strict";

/**
 * Cookie Consent Widget
 * A reusable, customizable widget for cookie consent.
 */

const defaultConfig = {
    containerSelector: ".cookies",
    acceptSelector: "button[type='submit']",
    declineSelector: "button[type='reset']",
    storageKey: "cookieConsent",
    policyUrl: "/cookie-policy/",
    autoInject: true,
    content: {
        title: "We use cookies!",
        description: `This website stores cookies on your computer. These cookies are used to collect information about how you interact with our website and allow us to remember you. We use this information in order to improve and customize your browsing experience and for analytics and metrics about our visitors both on this website and other media. To find out more, read our <a href="/cookie-policy/" title="Cookie policy">Cookie policy</a>.`,
        declineNotice: `If you decline, your information won't be tracked. A single cookie will be used to remember your preference.`
    },
    labels: {
        accept: "Accept",
        decline: "Decline"
    }
};

const createWidgetHTML = (config) => {
    const { content, labels } = config;
    return `
        <aside class="cookies flexy row" style="display: none;" role="dialog" aria-labelledby="cookie-title">
            <hgroup class="flexy row">
                <h4 id="cookie-title" title="${content.title}">${content.title}</h4>
                <p>${content.description}</p>
                <p>${content.declineNotice}</p>
            </hgroup>
            <form class="actions flexy row">
                <button type="submit" title="${labels.accept}" class="btn primary">${labels.accept}</button>
                <button type="reset" title="${labels.decline}" class="btn secondary">${labels.decline}</button>
            </form>
        </aside>
    `;
};

const injectWidget = (config) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = createWidgetHTML(config).trim();
    document.body.appendChild(wrapper.firstChild);
    console.log("Cookie widget has been injected.");
};

const showWidget = (element) => {
    element.hidden = false;
    element.style.display = "flex";
};

const hideWidget = (element) => {
    element.hidden = true;
    element.style.display = "none";
    element.remove();
};

const clearConsent = (config) => {
    const current = window.localStorage.getItem(config.storageKey);
    if (current) {
        if (current !== "accepted" && current !== "declined") {
            window.localStorage.removeItem(config.storageKey);
        } else {
            document.querySelector(config.containerSelector).remove();
        }

    }
};

const initializeCookiesWidget = (userConfig = {}) => {
    const config = Object.assign({}, defaultConfig, userConfig);

    // Inject the widget if it's not in the DOM
    if (config.autoInject && !document.querySelector(config.containerSelector)) {
        injectWidget(config);
    }

    const container = document.querySelector(config.containerSelector);
    const form = container?.querySelector("form");
    const acceptButton = container?.querySelector(config.acceptSelector);
    const declineButton = container?.querySelector(config.declineSelector);

    if (!container || !form || !acceptButton || !declineButton) {
        console.warn("Cookie consent widget elements not found.");
        return;
    }

    clearConsent(config);

    // Show widget if no consent is stored
    if (!window.localStorage.getItem(config.storageKey)) {
        showWidget(container);
    }

    acceptButton.addEventListener("click", (e) => {
        e.preventDefault();
        hideWidget(container);
        window.localStorage.setItem(config.storageKey, "accepted");
        console.log("Cookie consent: accepted");
    });

    declineButton.addEventListener("click", (e) => {
        e.preventDefault();
        hideWidget(container);
        window.localStorage.setItem(config.storageKey, "declined");
        console.log("Cookie consent: declined");
    });
};

export { initializeCookiesWidget };