"use strict";

import apiCall from "service";
import { createElement, addMessage } from "interface";
import { log, urlBase64ToUint8Array } from "utils";
import "https://unpkg.com/favicon-badge@2.0.0/dist/FavIconBadge.js";

/** Load Vapid's public key from the server. */
const loadVapidPublicKey = async () =>
    await apiCall({
        endpoint: "config/vapid",
        method: "POST",
    });

/** Send the subscription details to the server. */
const sendSubscriptionDetails = async (body) =>
    await apiCall({
        endpoint: "push/register",
        method: "POST",
        body: body,
    });

const sendMeNotification = async (body) =>
    await apiCall({
        endpoint: "push/sendNotification",
        method: "POST",
        body: body,
    });

const getQRImage = async (parameters) =>
    await apiCall({
        endpoint: `https://api.qrserver.com/v1/create-qr-code/?${parameters}`,
        external: true,
        output: "image/svg+xml"
    });
/** This registers a service worker, which runs in a worker context, and therefore has no DOM access. */
const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", async () => {
            try {
                const registration = await navigator.serviceWorker.register(
                    "http://localhost:2368/service-worker.js",
                    {
                        scope: "/",
                    }
                );

                const registrationX = await navigator.serviceWorker.register(
                    "http://localhost:2368/service-worker-messaging.js",
                    {
                        scope: "/members/",
                    }
                );

                if (registration.installing) {
                    log("Root service worker is installing...");
                } else if (registration.waiting) {
                    log("Root service worker has been installed.");
                } else if (registration.active) {
                    log(
                        "Service worker registered, activated and is running for scope",
                        registration.scope
                    );
                    registration.active.postMessage("Hi service worker.");
                    await initializePushSubscription(registration);
                    await registerPeriodicBackgroundSync(registration);

                    navigator.serviceWorker.addEventListener(
                        "message",
                        (event) => {
                            // event is a MessageEvent object
                            log(
                                `The service worker sent me a message: ${event.data}.`
                            );
                        }
                    );
                }

                if (registrationX.installing) {
                    log("[Firebase Service Worker] is installing...");
                } else if (registrationX.waiting) {
                    log("[Firebase Service Worker] has been installed.");
                } else if (registrationX.active) {
                    log(
                        "Service worker registered, activated and is running for scope",
                        registrationX.scope
                    );
                }
            } catch (error) {
                log("Ya sattār! " + error);
            }
        });
    } else {
        log("Service worker is not supported by this browser.");
    }
};

const initializeAppBadge = () => {
    // The `` custom element.
    const favicon = document.querySelector("favicon-badge");

    // Feature detection.
    const supportsAppBadge = "setAppBadge" in navigator;

    // This function will either set the favicon or the native
    // app badge. The implementation is dynamically changed at runtime.
    let setAppBadge;

    // Variable for the counter.
    let i = 0;

    // Returns a value between 0 and 9.
    const getAppBadgeValue = () => {
        if (i > 9) {
            i = 0;
        }
        return i++;
    };

    // Function to set a favicon badge.
    const setAppBadgeFavicon = (value) => {
        favicon.badge = value;
    };

    // Function to set a native app badge.
    const setAppBadgeNative = (value) => {
        navigator.setAppBadge(value);
    };

    // If the app is installed and native app badges are supported,
    // use the native app badge.
    if (matchMedia("(display-mode: standalone)").matches && supportsAppBadge) {
        setAppBadge = setAppBadgeNative;
        // In all other cases (i.e., if the app is not installed or native
        //  app badges are not supported), use the favicon badge.
    } else {
        setAppBadge = setAppBadgeFavicon;
    }

    // Update the badge every second.
    setInterval(() => {
        setAppBadge(getAppBadgeValue());
    }, 1000);
};

/** Use the PushManager to get the user's subscription to the push service. */
const initializePushSubscription = async (registration) => {
    try {
        let subscription = await registration.pushManager.getSubscription();

        /** If a subscription was found, return it. */
        if (!subscription) {
            /** Get the server's public key. */
            const { apiKey } = await loadVapidPublicKey();
            if (!apiKey)
                addMessage(
                    "No API public key returned from the server for TomTom service. Please check and try again."
                );

            /** Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet. */
            const convertedVapidKey = urlBase64ToUint8Array(atob(apiKey));

            /** Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to send notifications that don't have a visible effect for the user). */
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
            });

            await sendSubscriptionDetails({
                subscription: subscription,
            });
        }

        sendNotification(subscription);
    } catch (error) {
        log("Ya sattār! " + error);
    }
};

const available = document.querySelector(".available");
const notAvailable = document.querySelector(".not-available");
const ul = document.querySelector("ul");
const lastUpdated = document.querySelector(".last-updated");

const updateContent = async () => {
    const data = await fetch(
        "https://worldtimeapi.org/api/timezone/Europe/London.json"
    ).then((response) => response.json());
    return new Date(data.unixtime * 1000);
};

/** Periodically synchronize data in the background. */
const registerPeriodicBackgroundSync = async (registration) => {
    const available = document.querySelector(".available");
    const notAvailable = document.querySelector(".not-available");
    const ul = document.querySelector("ul");
    const lastUpdated = document.querySelector(".last-updated");

    const updateContent = async () => {
        const data = await fetch(
            "https://worldtimeapi.org/api/timezone/Europe/London.json"
        ).then((response) => response.json());
        return new Date(data.unixtime * 1000);
    };

    const status = await navigator.permissions.query({
        name: "periodic-background-sync",
    });
    if (status.state === "granted" && "periodicSync" in registration) {
        try {
            // Register the periodic background sync.
            await registration.periodicSync.register("content-sync", {
                // An interval of one day.
                minInterval: 24 * 60 * 60 * 1000,
            });
            available.hidden = false;
            notAvailable.hidden = true;

            // List registered periodic background sync tags.
            const tags = await registration.periodicSync.getTags();
            if (tags.length) {
                ul.innerHTML = "";
            }
            tags.forEach((tag) => {
                ul.appendChild(
                    createElement("li", {
                        textContent: tag,
                    })
                );
            });

            // Update the user interface with the last periodic background sync data.
            const backgroundSyncCache = await caches.open(
                "periodic-background-sync"
            );
            if (backgroundSyncCache) {
                const backgroundSyncResponse =
                    backgroundSyncCache.match("/last-updated");
                if (backgroundSyncResponse) {
                    lastUpdated.textContent = `${await fetch(
                        "/last-updated"
                    ).then((response) =>
                        response.text()
                    )} (periodic background-sync)`;
                }
            }

            // Listen for incoming periodic background sync messages.
            navigator.serviceWorker.addEventListener(
                "message",
                async (event) => {
                    if (event.data.tag === "content-sync") {
                        lastUpdated.textContent = `${await updateContent()} (periodic background sync)`;
                    }
                }
            );
        } catch (error) {
            log("Ya sattār! " + error);
            log(error.name, error.message);
            available.hidden = true;
            notAvailable.hidden = false;
            lastUpdated.textContent = "Never";
        }
    } else {
        available.hidden = true;
        notAvailable.hidden = false;
        lastUpdated.textContent = `${await updateContent()} (manual)`;
    }
};

const requestNotificationsPermission = () => {
    const button = document.getElementById("notifications");
    button.addEventListener("click", async () => {
        const permission = await Notification.requestPermission();
        if (permission === "granted") randomNotification();
    });
};

const games = [
    {
        slug: "lost-in-cyberspace",
        name: "Lost in Cyberspace",
        author: "Zosia and Bartek",
        twitter: "bartaz",
        website: "",
        github: "github.com/bartaz/lost-in-cyberspace",
    },
    {
        slug: "vernissage",
        name: "Vernissage",
        author: "Platane",
        twitter: "platane_",
        website: "github.com/Platane",
        github: "github.com/Platane/js13k-2017",
    },
    {
        slug: "coconutty",
        name: "Coconutty",
        author: "Mary Knize",
        twitter: "captainpainway",
        website: "maryknize.com",
        github: "github.com/captainpainway/coconutty",
    },
    {
        slug: "lost-pacman",
        name: "Lost Pacman",
        author: "MarcGuinea",
        twitter: "MarcGuineaCasas",
        website: "marcguinea.com",
        github: "github.com/mguinea/lost-pacman",
    },
    {
        slug: "polyhedron-runner",
        name: "Polyhedron Runner",
        author: "Alex Swan",
        twitter: "BoldBigflank",
        website: "bold-it.com",
        github: "github.com/BoldBigflank/js13k-polyhedron",
    },
    {
        slug: "she-is-my-universe",
        name: "She is my universe",
        author: "Madmarcel",
        twitter: "madmarcel",
        website: "",
        github: "github.com/madmarcel/js13k2017",
    },
    {
        slug: "spacewrecked",
        name: "Spacewrecked",
        author: "Sorskoot",
        twitter: "Sorskoot",
        website: "timmykokke.com",
        github: "github.com/sorskoot/js13kgames_2017_Lost",
    },
    {
        slug: "shifted-dimensions",
        name: "Shifted Dimensions",
        author: "Nylki",
        twitter: "nylk",
        website: "github.com/nylki",
        github: "github.com/nylki/shifted-dimensions",
    },
    {
        slug: "wandering-moon",
        name: "Wandering Moon",
        author: "Jack Greenberg",
        twitter: "thprgrmmrjck",
        website: "",
        github: "github.com/theProgrammerJack/js13k2017",
    },
    {
        slug: "lost-in-guam",
        name: "Lost in Guam",
        author: "Kenneth Banico",
        twitter: "kjdesigns671",
        website: "",
        github: "github.com/kbanico/lost-in-guam-vr-game",
    },
    {
        slug: "balloon-problems",
        name: "Balloon Problems",
        author: "Fasility",
        twitter: "Fasility_VR",
        website: "fasility.com",
        github: "github.com/flowerio/balloon-problems",
    },
    {
        slug: "lost-in-my-mind",
        name: "Lost in my mind",
        author: "Lasagne Games",
        twitter: "Lazyeels",
        website: "",
        github: "github.com/lazyeels/js13kb",
    },
    {
        slug: "lost-in-the-forest-dungeon",
        name: "Lost In The Forest Dungeon",
        author: "Luke",
        twitter: "cannl",
        website: "lc-apps.co.uk",
        github: "github.com/lcapps-luke/js13k-lost",
    },
    {
        slug: "galacticdiamond",
        name: "GalacticDiamond",
        author: "Mitruska",
        twitter: "mitruska_",
        website: "",
        github: "github.com/mitruch/GalacticDiamond-JS13KGames-2017",
    },
    {
        slug: "cat-meow",
        name: "Cat Meow",
        author: "Lislis",
        twitter: "",
        website: "",
        github: "github.com/lislis/cat-meow",
    },
    {
        slug: "metamorphosis",
        name: "Metamorphosis",
        author: "Steff and Tanyuan",
        twitter: "",
        website: "",
        github: "github.com/tanyuan/metamorphosis",
    },
    {
        slug: "a-snake",
        name: "A-Snake",
        author: "Nick Frazier",
        twitter: "nrf",
        website: "nickfrazier.com",
        github: "github.com/fraziern/vrsnake",
    },
    {
        slug: "wherewhat",
        name: "Where? What?",
        author: "..Katu..",
        twitter: "",
        website: "",
        github: "github.com/katubrd/LostVR",
    },
    {
        slug: "dont-let-your-dreams-be-memes",
        name: "Don't let your dreams be memes",
        author: "Mark Vasilkov",
        twitter: "mvasilkov",
        website: "mvasilkov.ovh",
        github: "github.com/mvasilkov/aframe13k",
    },
    {
        slug: "fly-south",
        name: "Fly South",
        author: "Christian Paul (jaller94)",
        twitter: "",
        website: "chrpaul.de",
        github: "github.com/jaller94/fly-south",
    },
    {
        slug: "prisonri0t",
        name: "PrisonRi0t",
        author: "Sondor",
        twitter: "",
        website: "",
        github: "github.com/gabboraron/prison",
    },
    {
        slug: "debriss",
        name: "DebrISS",
        author: "Kovolmany",
        twitter: "",
        website: "",
        github: "github.com/gabboraron/iss",
    },
    {
        slug: "vr-racing",
        name: "VR Racing",
        author: "Vedansh Bhartia and Kartikey Pandey",
        twitter: "",
        website: "",
        github: "github.com/vedanshbhartia/vr_racing",
    },
    {
        slug: "a-box-invaders",
        name: "A-box Invaders",
        author: "Felipe Do E. Santo",
        twitter: "felipez3r0",
        website: "hardcodigo.com.br",
        github: "github.com/felipez3r0/a-box-invaders",
    },
    {
        slug: "world-lost",
        name: "World Lost",
        author: "Ms. K. Bhuvana Meenakshi",
        twitter: "bhuvanakotees1",
        website: "bhuvanameenakshik.wixsite.com/bhuvanameenakshi",
        github: "github.com/bhuvanameenakshi/World_Lost",
    },
    {
        slug: "give-space",
        name: "Give Space",
        author: "Ram",
        twitter: "ram_gurumukhi",
        website: "gurumukhi.wordpress.com",
        github: "github.com/gurumukhi/13kGiveSpaceGame",
    },
    {
        slug: "lost-in-metaverse",
        name: "Lost in Metaverse",
        author: "Karan Ganesan",
        twitter: "karanganesan",
        website: "linkedin.com/in/karanganesan",
        github: "github.com/karanganesan/Lost_in_Metaverse",
    },
    {
        slug: "emma-3d",
        name: "Emma-3D",
        author: "Prateek Roushan",
        twitter: "",
        website: "",
        github: "github.com/coderprateek/Emma-3D",
    },
];

const randomNotification = () => {
    const randomItem = Math.floor(Math.random() * games.length);
    const notifTitle = games[randomItem].name;
    const notifBody = `Created by ${games[randomItem].author}.`;
    const notifImg = `assets/images/games/${games[randomItem].slug}.jpg`;
    const options = {
        body: notifBody,
        icon: notifImg,
        click_action: games[randomItem].github,
    };
    new Notification(notifTitle, options);
    setTimeout(randomNotification, 30000); // every 30 seconds
};

/** Ask the server to send the client a notification (for testing purposes, in actual applications the push notification is likely going to be generated by some event in the server). */
const sendNotification = (subscription) => {
    if (window.location.pathname === "/v1/portal/push") {
        const button = document.getElementById("doIt");
        button.addEventListener("click", async () => {
            const payload = document.getElementById(
                "notification-payload"
            ).value;
            const delay = document.getElementById("notification-delay").value;
            const ttl = document.getElementById("notification-ttl").value;

            await sendMeNotification({
                subscription: subscription,
                payload: payload,
                delay: delay,
                ttl: ttl,
            });
        });
    }
};

const getLocationAsync = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(resolve, reject);
        else reject(new Error("Geolocation is not supported by this browser."));
    });
};

const activeAppInstallButton = () => {
    // The install button.
    const installButton = document.getElementById("installWebApp");

    // Only relevant for browsers that support installation.
    if (!!installButton && "BeforeInstallPromptEvent" in window) {
        // Variable to stash the `BeforeInstallPromptEvent`.
        let installEvent = null;

        // Function that will be run when the app is installed.
        const onInstall = () => {
            // Disable the install button.
            installButton.disabled = true;
            // No longer needed.
            installEvent = null;

            if (supportsAppBadge) {
                // Remove the favicon badge.
                favicon.badge = false;
                // Switch the implementation so it uses the native
                // app badge.
                setAppBadge = setAppBadgeNative;
            }
        };

        window.addEventListener("beforeinstallprompt", (event) => {
            // Do not show the install prompt quite yet. Shows warning of Banner not shown: beforeinstallpromptevent.preventDefault() called. The page must call beforeinstallpromptevent.prompt() to show the banner.
            event.preventDefault();
            // Stash the `BeforeInstallPromptEvent` for later.
            installEvent = event;
            // Enable the install button.
            installButton.disabled = false;
        });

        installButton.addEventListener("click", async () => {
            // If there is no stashed `BeforeInstallPromptEvent`, return.
            if (!installEvent) {
                return;
            }
            // Use the stashed `BeforeInstallPromptEvent` to prompt the user.
            installEvent.prompt();
            const result = await installEvent.userChoice;
            // If the user installs the app, run `onInstall()`.
            if (result.outcome === "accepted") {
                onInstall();
            }
        });

        // The user can decide to ignore the install button
        // and just use the browser prompt directly. In this case
        // likewise run `onInstall()`.
        window.addEventListener("appinstalled", (event) => {
            onInstall();
        });
    }
};

/** To request Bluetooth pairing the Web Bluetooth API lets websites discover and communicate with devices over the Bluetooth 4 wireless standard using the Generic Attribute Profile (GATT). It is currently partially implemented in Android M, Chrome OS, Mac, and Windows 10. Note: This feature is still under development. You must be using Chrome with the chrome://flags/#enable-web-bluetooth-new-permissions-backend flag enabled. */
const populateBluetoothDevices = async () => {
    let devicesSelect = null;
    if (!document.querySelector("#devicesSelect")) {

        const outerContainer = createElement("div", { className: "flexy" });
        const innerContainer = createElement("div", { className: "flexy" });
        const requestBluetoothButton = createElement("button", {
            type: "button",
            id: "requestBluetoothDevice",
            title: "Request Bluetooth Device",
            textContent: "Request Bluetooth Device",
            onclick: onRequestBluetoothDeviceButtonClick
        });

        const forgetBluetoothButton = createElement("button", {
            type: "button",
            id: "forgetBluetoothDevice",
            title: "Forget Bluetooth Device",
            textContent: "Forget Bluetooth Device",
            onclick: onForgetBluetoothDeviceButtonClick
        });

        devicesSelect = createElement("select", {
            id: "devicesSelect",
            textContent: "",
        });

        innerContainer.append(devicesSelect, forgetBluetoothButton);
        outerContainer.append(requestBluetoothButton, innerContainer);
        document.body.appendChild(outerContainer);

    } else {
        devicesSelect = document.querySelector("#devicesSelect");
    }

    try {


        // const btPermission = await navigator.permissions.query({
        //     name: "bluetooth",
        // });

        // // The permission state will be granted, denied or prompt (requires user acknowledgement of a prompt).
        // if (btPermission.state !== "denied") {
        //     // Do something
        // }

        log("Getting existing permitted Bluetooth devices...");
        const devices = await navigator.bluetooth.getDevices();

        log(`> Got ${devices.length} Bluetooth devices.`);
        while (devicesSelect.firstChild) devicesSelect.removeChild(devicesSelect.firstChild);
        for (const device of devices) {
            devicesSelect.appendChild(
                createElement("option", {
                    value: device.id,
                    textContent: device.name,
                })
            );
        }
    } catch (error) {
        log("Ya sattār! " + error);
    }
};

const onRequestBluetoothDeviceButtonClick = async () => {
    try {
        log("Requesting any Bluetooth device...");
        const device = await navigator.bluetooth.requestDevice({
            // filters: [...] <- Prefer filters to save energy & show relevant devices.
            acceptAllDevices: true,
        });

        log(`> Requested ${device.name} (${device.id})`);
        populateBluetoothDevices();
    } catch (error) {
        log("Ya sattār! " + error);
    }
};

const onForgetBluetoothDeviceButtonClick = async () => {
    try {
        const devices = await navigator.bluetooth.getDevices();

        const deviceIdToForget = document.querySelector("#devicesSelect").value;
        const device = devices.find((device) => device.id == deviceIdToForget);
        if (!device) {
            throw new Error("No Bluetooth device to forget");
        }
        log("Forgetting " + device.name + "Bluetooth device...");
        await device.forget();

        log("  > Bluetooth device has been forgotten.");
        populateBluetoothDevices();
    } catch (error) {
        log("Ya sattār! " + error);
    }
};

/** The Web Locks API allows scripts running in one tab or worker to asynchronously acquire a lock, hold it while work is performed, then release it. While held, no other script executing in the same origin can acquire the same lock, which allows a web app running in multiple tabs or workers to coordinate work and the use of resources. */
const lockMeUp = async () => {
    await do_something_without_lock();

    // Request the lock.
    await navigator.locks.request("my_resource", async (lock) => {
        // The lock has been acquired.
        await do_something_with_lock();
        await do_something_else_with_lock();
        // Now the lock will be released.
    });
    // The lock has been released.

    await do_something_else_without_lock();

};

/** The Element interface's animate() method is a shortcut method which creates a new Animation, applies it to the element, then plays the animation. It returns the created Animation object instance. */
const animate = (keyframes, options) => {
    const newspaperSpinning = [
        { transform: "rotate(0) scale(1)" },
        { transform: "rotate(360deg) scale(0)" },
    ];

    const newspaperTiming = {
        duration: 2000,
        iterations: 1,
    };

    const newspaper = document.querySelector(".newspaper");

    newspaper.addEventListener("click", () => {
        newspaper.animate(newspaperSpinning, newspaperTiming);
    });
};

/** The Web Share API provides a mechanism for sharing text, links, files, and other content to an arbitrary share target selected by the user. */
const shareMeNow = () => {
    const shareData = {
        title: "MDN",
        text: "Learn web development on MDN!",
        url: "https://developer.mozilla.org",
    };

    const btn = document.querySelector("button");
    const resultPara = document.querySelector(".result");

    // Share must be triggered by "user activation"
    btn.addEventListener("click", async () => {
        try {
            await navigator.share(shareData);
            resultPara.textContent = "MDN shared successfully";
        } catch (error) {
            log("Ya sattār! " + error);
            resultPara.textContent = `Error: ${error}`;
        }
    });
};

/** Most modern mobile devices include vibration hardware, which lets software code provide physical feedback to the user by causing the device to shake. The Vibration API offers Web apps the ability to access this hardware, if it exists, and does nothing if the device doesn't support it. */
const accessVibrationHardware = () => {
    let vibrateInterval;

    // Starts vibration at passed in level
    const startVibrate = (duration) => navigator.vibrate(duration);

    // Stops vibration
    const stopVibrate = () => {
        // Clear interval and stop persistent vibrating
        if (vibrateInterval) clearInterval(vibrateInterval);
        navigator.vibrate(0);
    };

    // Start persistent vibration at given duration and interval
    // Assumes a number value is given
    const startPersistentVibrate = (duration, interval) => {
        vibrateInterval = setInterval(() => {
            startVibrate(duration);
        }, interval);
    };

};

/** The brands read-only property of the NavigatorUAData interface returns an array of brand information (brand, version). */
const x = () => navigator.userAgentData.brands;

/** Returning a number of hints, a dictionary object containing the high entropy values the user-agent returns. */
const requestUserAgentHints = async () => {
    try {
        const hints = await navigator.userAgentData
            .getHighEntropyValues([
                "architecture",
                "model",
                "platform",
                "platformVersion",
                "fullVersionList",
            ]);

        log(hints);
        document.body.appendChild(createElement("code", { textContent: JSON.stringify(hints, null, 2) }));
    } catch (error) {
        log("Ya sattār!", error);
    }

};

const getPat = () => {
    // Segment prefixing does not occur outside of pathname patterns
    const pattern = new URLPattern({ hash: "/books/:id?" });
    console.log(pattern.test("https://example.com#/books/123")); // true
    console.log(pattern.test("https://example.com#/books")); // false
    console.log(pattern.test("https://example.com#/books/")); // true

};

/** The Screen Capture API introduces additions to the existing Media Capture and Streams API to let the user select a screen or portion of a screen (such as a window) to capture as a media stream. This stream can then be recorded or shared with others over the network. */
const startCapturingVideo = async () => {
    console.clear();
    const displayMediaOptions = {
        video: {
            displaySurface: "browser",
        },
        audio: {
            suppressLocalAudioPlayback: false,
        },
        preferCurrentTab: false,
        selfBrowserSurface: "exclude",
        systemAudio: "include",
        surfaceSwitching: "include",
        monitorTypeSurfaces: "include",
    };
    let captureStream = null;

    try {
        captureStream =
            await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    } catch (error) {
        log("Ya sattār!", error);
    }
    return captureStream;

};


/*

<header>
        <h1>Wake Lock Demo</h1>
    </header>

    <p>The button below changes depending on whether wake lock is active or not.</p>

    <button data-status="off">Turn Wake Lock ON</button>

    <section id="status">
        <h2>Wake Lock Status</h2>
        <p></p>
    </section>
	
    <p>Wake lock will automatically release if if the tab becomes inactive.</p>
    <p>To re-activate the wake lock automatically when the tab becomes active again, check this box: <input type="checkbox" id="reaquire" /></p>

*/

/** Request a wake lock. The Screen Wake Lock API provides a way to prevent devices from dimming or locking the screen when an application needs to keep running. */
const requestWakeLock = async () => {

    console.clear();

    // status paragraph
    const statusElem = document.querySelector('#status p');
    // toggle button
    const wakeButton = document.querySelector('[data-status]');
    // checkbox
    const reaquireCheck = document.querySelector('#reaquire');

    // change button and status if wakelock becomes aquired or is released
    const changeUI = (status = 'acquired') => {
        const acquired = status === 'acquired' ? true : false;
        wakeButton.dataset.status = acquired ? 'on' : 'off';
        wakeButton.textContent = `Turn Wake Lock ${acquired ? 'OFF' : 'ON'}`;
        statusElem.textContent = `Wake Lock ${acquired ? 'is active!' : 'has been released.'}`;
    }

    // test support
    let isSupported = false;

    if ('wakeLock' in navigator) {
        isSupported = true;
        statusElem.textContent = 'Screen Wake Lock API supported 🎉';
    } else {
        wakeButton.disabled = true;
        statusElem.textContent = 'Wake lock is not supported by this browser.';
    }

    if (isSupported) {
        // create a reference for the wake lock
        let wakeLock = null;

        // create an async function to request a wake lock
        const requestWakeLock = async () => {
            try {
                wakeLock = await navigator.wakeLock.request('screen');

                // change up our interface to reflect wake lock active
                changeUI();

                // listen for our release event
                wakeLock.onrelease = function (ev) {
                    console.log(ev);
                }
                wakeLock.addEventListener('release', () => {
                    // if wake lock is released alter the button accordingly
                    changeUI('released');
                });

            } catch (err) {
                // if wake lock request fails - usually system related, such as battery
                wakeButton.dataset.status = 'off';
                wakeButton.textContent = 'Turn Wake Lock ON';
                statusElem.textContent = `${err.name}, ${err.message}`;

            }
        } // requestWakeLock()

        // if we click our button
        wakeButton.addEventListener('click', () => {
            // if wakelock is off request it
            if (wakeButton.dataset.status === 'off') {
                requestWakeLock()
            } else { // if it's on release it
                wakeLock.release()
                    .then(() => {
                        wakeLock = null;
                    })
            }
        })

        const handleVisibilityChange = () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                requestWakeLock();
            }
        }

        reaquireCheck.addEventListener('change', () => {
            if (reaquireCheck.checked) {
                document.addEventListener('visibilitychange', handleVisibilityChange);
            } else {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            }
        });

    } // isSupported
};

/**  Access and manipulate the portion of a document selected by the user. Selection object represents the range of text selected by the user or the current position of the caret. A user may make a selection from left to right (in document order) or right to left (reverse of document order). The anchor is where the user began the selection and the focus is where the user ends the selection. If you make a selection with a desktop mouse, the anchor is placed where you pressed the mouse button, and the focus is placed where you released the mouse button. */
const processSelection = () => {



    document.addEventListener("selectstart", (event) => log("Selection started."));

    document.addEventListener("selectionchange", newSelectionHandler);

    // The button cancel all selection ranges
    const button = createElement("button", {
        type: "button",
        id: "Clear selection",
        title: "Clear selection",
        textContent: "Clear selection",
        onclick: () => document.getSelection().empty()
    });

    document.body.appendChild(button);
};

// Logs if there is a selection or not
const newSelectionHandler = () => {
    let logs = document.getElementById("logs");
    if (!logs) {
        logs = createElement("p", { id: "logs" });
        document.body.appendChild(logs);
    }

    try {

        // The selection object is a singleton associated with the document
        const selection = document.getSelection();
        const range = selection.getRangeAt(0);
        if (selection.rangeCount !== 0) {
            logs.textContent = "Some text is selected.";
            log(selection);
        } else {
            logs.textContent = "No selection on this document.";
        }
    } catch (error) {
        log("Ya sattār!", error);
    }
};

/** The Storage API gives websites the ability to find out how much space they can use, how much they are already using, and even control whether or not they need to be alerted before the user agent disposes of data in order to make room for other things. */
const accessStorageStandard = async () => {
    try {
        // change an origin's storage bucket mode 
        if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().then((persistent) => {
                if (persistent) {
                    console.log("Storage will not be cleared except by explicit user action");
                } else {
                    console.log("Storage may be cleared by the UA under storage pressure.");
                }
            });
        }

        // know whether an origin's storage is persistent or not
        if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persisted().then((persistent) => {
                if (persistent) {
                    console.log("Storage will not be cleared except by explicit user action");
                } else {
                    console.log("Storage may be cleared by the UA under storage pressure.");
                }
            });
        }

        // To determine the estimated quota and usage values for a given origin, returns an object that contains these figures.
        navigator.storage.estimate().then((estimate) => {
            // estimate.quota is the estimated quota
            // estimate.usage is the estimated number of bytes used
        });

    } catch (error) {
        log("Ya sattār!", error);
    }
};


/*** The Reporting API provides a generic reporting mechanism for web applications to use to make reports available based on various platform features (for example Content Security Policy, Permissions-Policy, or feature deprecation reports) in a consistent manner. */


// Set up function to display reports
function displayReports(reports) {
    const outputElem = document.querySelector('.output');
    const list = document.createElement('ul');
    outputElem.appendChild(list);

    for (let i = 0; i < reports.length; i++) {
        let listItem = document.createElement('li');
        let textNode = document.createTextNode('Report ' + (i + 1) + ', type: ' + reports[i].type);
        listItem.appendChild(textNode);
        let innerList = document.createElement('ul');
        listItem.appendChild(innerList);
        list.appendChild(listItem);

        for (let key in reports[i].body) {
            let innerListItem = document.createElement('li');
            let keyValue = reports[i].body[key];
            innerListItem.textContent = key + ': ' + keyValue;
            innerList.appendChild(innerListItem);
        }
    }
}

/** Create a simple reporting observer to observe usage of deprecated features on our web page. */
const reportDeprecatedFeatures = () => {
    // Get reference to button
    const reportBtn = document.querySelector('button');

    const options = {
        types: ["deprecation"],
        buffered: true,
    };

    const observer = new ReportingObserver((reports, observer) => {
        reportBtn.onclick = () => displayReports(reports);
    }, options);

    // try to use old-style getUserMedia
    const videoElem = document.querySelector('video');

    const constraints = {
        audio: true,
        video: {
            width: 480,
            height: 320
        }
    }

    observer.observe();

    if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia(
            constraints,
            success,
            failure);
    } else {
        navigator.getUserMedia(
            constraints,
            success,
            failure);
    }

    let takenRecords = observer.takeRecords();
    console.log(takenRecords);

    if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia(
            constraints,
            success,
            failure);
    } else {
        navigator.getUserMedia(
            constraints,
            success,
            failure);
    }

    // observer.disconnect();

    function success(stream) {
        videoElem.srcObject = stream;
        videoElem.onloadedmetadata = () => videoElem.play();
    }

    function failure(e) {
        console.log('The following gUM error occured: ' + e)
    }

};


/*** The Popover API provides developers with a standard, consistent, flexible mechanism for displaying popover content on top of other page content. Popover content can be controlled either declaratively using HTML attributes, or via JavaScript. */
const startPopovers = () => {
    try {
        const instructions = document.getElementById("instructions");
        const popover = document.getElementById("mypopover");

        if (!HTMLElement.prototype.hasOwnProperty("popover")) {
            popover.innerText = "";
            instructions.innerText = "Popovers not supported";
        } else {
            document.addEventListener("keydown", (event) => {
                if (event.key === "h") {
                    const popupOpened = popover.togglePopover();

                    // Check if popover is opened or closed on supporting browsers
                    if (popupOpened !== undefined) {
                        instructions.innerText +=
                            popupOpened === true ? `\nOpened` : `\nClosed`;
                    }
                }
            });
        }
    } catch (error) {
        log("Ya sattār!", error);
    }
};


/*** Returns the state of a user permission on the global scope. */
const testSupportForVariousPermissions = () => {
    try {
        // Array of permissions
        const permissions = [
            "accelerometer",
            "accessibility-events",
            "ambient-light-sensor",
            "background-sync",
            "camera",
            "clipboard-read",
            "clipboard-write",
            "geolocation",
            "gyroscope",
            "local-fonts",
            "magnetometer",
            "microphone",
            "midi",
            "notifications",
            "payment-handler",
            "persistent-storage",
            "push",
            "screen-wake-lock",
            "storage-access",
            "top-level-storage-access",
            "window-management",
        ];

        processPermissions();

        // Iterate through the permissions and log the result
        async function processPermissions() {
            for (const permission of permissions) {
                const result = await getPermission(permission);
                log(result);
            }
        }

        // Query a single permission in a try...catch block and return result
        async function getPermission(permission) {
            try {
                const result = await navigator.permissions.query({ name: permission });
                return `${permission}: ${result.state}`;
            } catch (error) {
                return `${permission} (not supported)`;
            }
        }
    } catch (error) {
        log("Ya sattār!", error);
    }
};
/** This example watches for changes to the user's connection. */
const detectConnectionChanges = () => {
    try {
        let type = navigator.connection.effectiveType;

        function updateConnectionStatus() {
            console.log(
                `Connection type changed from ${type} to ${navigator.connection.effectiveType}`,
            );
            type = navigator.connection.effectiveType;
        }

        navigator.connection.addEventListener("change", updateConnectionStatus);

    } catch (error) {
        log("Ya sattār!", error);
    }
};

/** The connection object is useful for deciding whether to preload resources that take large amounts of bandwidth or memory. This example would be called soon after page load to check for a connection type where preloading a video may not be desirable. If a cellular connection is found, then the preloadVideo flag is set to false. */
const preloadLargeResources = () => {
    try {
        let preloadVideo = true;
        const connection = navigator.connection;
        if (connection) {
            if (connection.effectiveType === "slow-2g") {
                preloadVideo = false;
            }
        }

    } catch (error) {
        log("Ya sattār!", error);
    }
};

/** Display news based on geolocation permission. */
const displayNewsLocally = () => {
    try {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            if (result.state === "granted") {
                showLocalNewsWithGeolocation();
            } else if (result.state === "prompt") {
                showButtonToEnableLocalNews();
            }
            // Don't do anything if the permission was denied.
        });
    } catch (error) {
        log("Ya sattār!", error);
    }

};

/** Create a detector and log changes to the user's idle state. A button is used to get the necessary user activation before requesting permission. The Idle Detection API provides a means to detect the user's idle status, active, idle, and locked, specifically, and to be notified of changes to idle status without polling from a script. */
const createDetectorAndLogChanges = () => {
    try {
        const controller = new AbortController();
        const signal = controller.signal;

        startButton.addEventListener("click", async () => {
            if ((await IdleDetector.requestPermission()) !== "granted") {
                console.error("Idle detection permission denied.");
                return;
            }

            try {
                const idleDetector = new IdleDetector();
                idleDetector.addEventListener("change", () => {
                    const userState = idleDetector.userState;
                    const screenState = idleDetector.screenState;
                    console.log(`Idle change: ${userState}, ${screenState}.`);
                });

                await idleDetector.start({
                    threshold: 60_000,
                    signal,
                });
                console.log("IdleDetector is active.");
            } catch (err) {
                // Deal with initialization errors like permission denied,
                // running outside of top-level frame, etc.
                console.error(err.name, err.message);
            }
        });

        stopButton.addEventListener("click", () => {
            controller.abort();
            console.log("IdleDetector is stopped.");
        });

    } catch (error) {
        log("Ya sattār!", error);
    }
};

/** HTML Drag and Drop interfaces enable applications to use drag-and-drop features in browsers. */
const dragDropMe = () => {
    try {
        log("TODO: See https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API");
    } catch (error) {
        log("Ya sattār!", error);
    }
};

/** Provides access to the browser's session history through the history global object. It exposes useful methods and properties that let you navigate back and forth through the user's history, and manipulate the contents of the history stack. */
const illustrateSessionHistory = () => {
    try {
        window.addEventListener("popstate", (event) => {
            alert(
              `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
            );
          });
          
          history.pushState({ page: 1 }, "title 1", "?page=1");
          history.pushState({ page: 2 }, "title 2", "?page=2");
          history.replaceState({ page: 3 }, "title 3", "?page=3");
          history.back(); // alerts "location: http://example.com/example.html?page=1, state: {"page":1}"
          history.back(); // alerts "location: http://example.com/example.html, state: null"
          history.go(2); // alerts "location: http://example.com/example.html?page=3, state: {"page":3}"
          
    } catch (error) {
        log("Ya sattār!", error);
    }
};

/** This provides information about the system's battery charge level and lets you be notified by events that are sent when the battery level or charging status change. This can be used to adjust your app's resource usage to reduce battery drain when the battery is low, or to save changes before the battery runs out in order to prevent data loss. */
const getBatteryStatus = () => {
    try {
        navigator.getBattery().then((battery) => {
            function updateAllBatteryInfo() {
              updateChargeInfo();
              updateLevelInfo();
              updateChargingInfo();
              updateDischargingInfo();
            }
            updateAllBatteryInfo();
          
            battery.addEventListener("chargingchange", () => {
              updateChargeInfo();
            });
            function updateChargeInfo() {
              console.log(`Battery charging? ${battery.charging ? "Yes" : "No"}`);
            }
          
            battery.addEventListener("levelchange", () => {
              updateLevelInfo();
            });
            function updateLevelInfo() {
              console.log(`Battery level: ${battery.level * 100}%`);
            }
          
            battery.addEventListener("chargingtimechange", () => {
              updateChargingInfo();
            });
            function updateChargingInfo() {
              console.log(`Battery charging time: ${battery.chargingTime} seconds`);
            }
          
            battery.addEventListener("dischargingtimechange", () => {
              updateDischargingInfo();
            });
            function updateDischargingInfo() {
              console.log(`Battery discharging time: ${battery.dischargingTime} seconds`);
            }
          });
          
    } catch (error) {
        log("Ya sattār!", error);
    }
};

/** This detects linear and two-dimensional barcodes in images. Support for barcode recognition within web apps unlocks a variety of use cases through supported barcode formats. QR codes can be used for online payments, web navigation or establishing social media connections, Aztec codes can be used to scan boarding passes and shopping apps can use EAN or UPC barcodes to compare prices of physical items. Read https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API */
const detectBarcodes = async () => {
    try {
        barcodeDetector
  .detect(imageEl)
  .then((barcodes) => {
    barcodes.forEach((barcode) => console.log(barcode.rawValue));
  })
  .catch((err) => {
    console.log(err);
  });

    } catch (error) {
        log("Ya sattār!", error);
    }
};

/** Test for browser compatibility and creates a new barcode detector object, with specified supported formats. */
const createDetector = () => {
    try {
        // check compatibility
if (!("BarcodeDetector" in globalThis)) {
    console.log("Barcode Detector is not supported by this browser.");
  } else {
    console.log("Barcode Detector supported!");
  
    // create new detector
    const barcodeDetector = new BarcodeDetector({
      formats: ["code_39", "codabar", "ean_13"],
    });
  }
  
    } catch (error) {
        log("Ya sattār!", error);
    }
};

/** Getting Supported Formats. */
const getSupportedQR = () => {
    // check supported types
BarcodeDetector.getSupportedFormats().then((supportedFormats) => {
    supportedFormats.forEach((format) => console.log(format));
  });
  
};

const createQRCodeImage = async (value, properties) => {
    // &size=1000000x1000000
    const parameters = `format=svg&charset-source=UTF-8&color=000000&bgcolor=0000ff&data=${window.encodeURIComponent(value)}`;
    // Create an object URL for the Blob
    const blob = await getQRImage(parameters);

    console.log("We got a new QR code blob...");
    console.log(blob);

    // const objectUrl = URL.createObjectURL(blob);

    // Create an image element and set its source
    const img = createElement("img", {
        src: blob,
        title: "QR Code",
        alt: "QR Code"
    });

    // Append the image to the body or another element
    document.body.appendChild(img);

    // Optionally, revoke the object URL after use to free memory
    // img.onload = () => URL.revokeObjectURL(objectUrl);
};

/** Using Background Fetch requires a registered service worker. Then call backgroundFetch.fetch() to perform a fetch. This returns a promise that resolves with a BackgroundFetchRegistration. A background fetch may fetch a number of files. In our example the fetch requests an MP3 and a JPEG. This enables a package of files that the user sees as one item (for example a podcast and artwork) to be downloaded at once. */
const implementBackgroundFetch = () => {
    try {
        navigator.serviceWorker.ready.then(async (swReg) => {
            const bgFetch = await swReg.backgroundFetch.fetch(
              "my-fetch",
              ["/ep-5.mp3", "ep-5-artwork.jpg"],
              {
                title: "Episode 5: Interesting things.",
                icons: [
                  {
                    sizes: "300x300",
                    src: "/ep-5-icon.png",
                    type: "image/png",
                  },
                ],
                downloadTotal: 60 * 1024 * 1024,
              },
            );
          });
          
    } catch (error) {
        log("Ya sattār!", error);
    }
};

export {
    registerServiceWorker,
    requestNotificationsPermission,
    getLocationAsync,
    activeAppInstallButton,
    populateBluetoothDevices,
    requestUserAgentHints,
    processSelection,
    createQRCodeImage,

};
