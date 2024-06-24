"use strict";

const id = (id) => document.getElementById(id),
    qs = (selector) => document.querySelector(selector),
    qsa = (selector) => document.querySelectorAll(selector);


const offlineDetection = () => {
    try {
        window.addEventListener("online", () => console.log("You are online!"));
        window.addEventListener("offline", () => {
            console.log("Oh no, you lost your network connection.");
            navigator.serviceWorker.controller.postMessage({
                type: `IS_OFFLINE`
                // add more properties if needed
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const getFileSize = (numberOfBytes) => {
    const units = [
        "B",
        "KiB",
        "MiB",
        "GiB",
        "TiB",
        "PiB",
        "EiB",
        "ZiB",
        "YiB",
    ],
        exponent = Math.min(Math.floor(Math.log(numberOfBytes) / Math.log(1024)), units.length - 1),
        approx = numberOfBytes / 1024 ** exponent;

    return exponent === 0 ? `${numberOfBytes} bytes` : `${approx.toFixed(3)} ${units[exponent]} (${numberOfBytes} bytes)`;
};

const setCountries = () => {

    const countries = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antigua &amp; Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bosnia &amp; Herzegovina",
        "Botswana",
        "Brazil",
        "British Virgin Islands",
        "Brunei",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cape Verde",
        "Cayman Islands",
        "Central Arfrican Republic",
        "Chad",
        "Chile",
        "China",
        "Colombia",
        "Congo",
        "Cook Islands",
        "Costa Rica",
        "Cote D Ivoire",
        "Croatia",
        "Cuba",
        "Curacao",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Ethiopia",
        "Falkland Islands",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Polynesia",
        "French West Indies",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea Bissau",
        "Guyana",
        "Haiti",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Kosovo",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macau",
        "Macedonia",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Mauritania",
        "Mauritius",
        "Mexico",
        "Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauro",
        "Nepal",
        "Netherlands",
        "Netherlands Antilles",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "North Korea",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Reunion",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Pierre &amp; Miquelon",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Korea",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "St Kitts &amp; Nevis",
        "St Lucia",
        "St Vincent",
        "Sudan",
        "Suriname",
        "Swaziland",
        "Sweden",
        "Switzerland",
        "Syria",
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Timor L'Este",
        "Togo",
        "Tonga",
        "Trinidad &amp; Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks &amp; Caicos",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States of America",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Vatican City",
        "Venezuela",
        "Vietnam",
        "Virgin Islands (US)",
        "Yemen",
        "Zambia",
        "Zimbabwe"
    ];

    try {
        const size = countries.length;

        console.log("Total countries: ", size);
        countries.forEach(country => {
            if (typeof country !== "string") throw new TypeError("Input must be a number");
            console.log("Country: ", country);
        });
    } catch (error) {
        console.log(error);
    }
};

const registerServiceWorker = (env = "LIVE") => {
    if (!("serviceWorker" in navigator)) false;
    // Wait to not block other work
    window.addEventListener("load", async () => {
        try {
            let registration;
            // Use ES Module version of our Service Worker in development
            if (env === "DEV") {
                registration = await navigator.serviceWorker.register("/service-worker.mjs", {
                    type: "module",
                    scope: "/"
                });
                console.log("Service worker registered in development! 😎", registration);
            } else {
                // In production, use the normal service worker registration
                // registration = await navigator.serviceWorker.register("/service-worker.js");
                registration = await navigator.serviceWorker.register("/service-worker.mjs", {
                    type: "module",
                    scope: "/"
                });
                console.log("Service worker registered in production! 😎", registration);
            }
            addAppInstallButton();

        } catch (error) {
            console.log("😥 Service worker registration failed: ", error);
        }
    });

    if (navigator.serviceWorker.controller) {
        window.addEventListener("load", function () {
            navigator.serviceWorker.controller.postMessage({
                type: `CLEAN_UP`
                // add more properties if needed
            });
        });
    }
};

// Shares a link with the Web Share API
const sharingLinks = async () => {
    const shareData = {
        title: "PWinter",
        text: "Design your own PWA Logo.",
        url: "https://diek.us/pwinter",
    };
    try {
        await navigator.share(shareData);
        console.log('PWinter shared!');
    } catch (e) {
        console.error(e);
    }
};

// Shares a file with the Web Share API
const sharingFiles = async () => {
    let fileToShare = createFileForSharing(preparePWALogoforSVG()),
        filesArray = [];

    filesArray[0] = fileToShare;
    if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        try {
            await navigator.share({
                files: filesArray,
                title: 'My PWA Logo',
                text: 'Custom PWA logo from The PWinter.'
            });
            console.log('Share was successful.');
        } catch (error) {
            console.log('Sharing failed', error);
        }
    } else {
        console.log(`System doesn't support sharing.`);
    }
};

const cachingBasics = async () => {
    if ("caches" in window) {

        const appName = "elite-drivers-",
            version = "v1:",
            sw_caches = {
                assets: {
                    name: `${appName}${version}assets`,
                    drivers: {
                        name: `${appName}${version}drivers`,
                        limit: 50
                    },
                    cars: {
                        name: `${appName}${version}cars`,
                        limit: 10
                    }
                }
            };
        // Yay! The Cache API is accessible as caches.
        const app_cache = await caches.open(sw_caches.assets.name);

        // Add a single Request
        app_cache.add("/path/to/resource.ext"); // requests the resource and adds it to the cache
        app_cache.add(new Request("/path/to/resource.ext")); // does the same thing
        app_cache.put("/path/to/resource.ext"); // same again, but using put()

        // Add a bunch of Requests
        const app_files = [
            "/path/to/resource-1.ext",
            "/path/to/resource-2.ext"
        ];

        app_cache.addAll(app_files);
        // requests & caches all of them

        // generates a new synthetic response & 
        // caches it as though it was 
        // "/path/to/generated.json"
        app_cache.put(
            "/path/to/generated.json",
            new Response('{ "generated_by": "my service worker" }')
        );

        // Store a non-CORS/3rd party Request
        app_cache.put("https://another.tld/resource.ext");

        const response = await app_cache.match("/path/to/generated.json");

        if (false) cache.delete("/path/to/generated.json");
    }
};

// Check if the API is supported
if ('setAppBadge' in navigator) {
    navigator.setAppBadge(2).catch((error) => {
        // Code to handle an error
    });
}

const removeBadge = () => {
    navigator.clearAppBadge();
    // or
    navigator.setAppBadge(0);
};

const checkPushManager = () => {
    try {
        if (!("PushManager" in window)) {

            // Code to disable or hide push-related UI controls

            console.log("Push API is not supported");
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};

const addAppInstallButton = () => {

    // Get the install button.
    const installButton = id("appInstallButton");

    // Only relevant for browsers that support installation.
    if ("BeforeInstallPromptEvent" in window) {
        // Variable to stash the `BeforeInstallPromptEvent`.
        let installEvent = null;

        // Function that will be run when the app is installed.
        const onInstall = () => {
            // Disable the install button.
            installButton.disabled = true;
            // Remove the install button.
            installButton.remove();
            // No longer needed.
            installEvent = null;
        };

        window.addEventListener("beforeinstallprompt", (event) => {
            // Do not show the install prompt quite yet.
            event.preventDefault();
            // Stash the `BeforeInstallPromptEvent` for later.
            installEvent = event;
            // Enable the install button.
            installButton.disabled = false;
        });

        installButton.addEventListener("click", async () => {
            // If there is no stashed `BeforeInstallPromptEvent`, return.
            if (!installEvent) return;
            // Use the stashed `BeforeInstallPromptEvent` to prompt the user.
            installEvent.prompt();
            const result = await installEvent.userChoice;
            // If the user installs the app, run `onInstall()`.
            if (result.outcome === "accepted") onInstall();
        });

        // The user can decide to ignore the install button
        // and just use the browser prompt directly. In this case
        // likewise run `onInstall()`.
        window.addEventListener("appinstalled", () => onInstall());
    }
};

const subscribeForPush = async () => {
    const registration = await navigator.serviceWorker.ready;

    const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, // Should be always true as currently browsers only support explicitly visible notifications
        applicationServerKey: "publicKey from Step 1 converted to Uint8Array"
    });

    // Send push subscription to our server to persist it
    saveSubscription(pushSubscription);
};

const clearSiteData = () => {
    try {
        if (confirm("Are you sure you want to clear site data?")) {
            unregisterServiceWorkers();
            clearLocalStorage();
            clearSessionStorage();
            clearIndexedDB();
            clearWebSQL();
            clearCookies();
            clearCacheStorage();
            // Show confirmation message
            const messageElement = document.createElement("div");
            messageElement.textContent = "Site data has been cleared. The page will reload in three seconds...";
            messageElement.classList.add("flexy", "confirmation-message");
            document.body.appendChild(messageElement);
            setTimeout(() => {
                qs("*.confirmation-message").remove();
                window.location.reload();
            }, 3000);
            
        }
    } catch (error) {
        console.log(error);
    }
};

const unregisterServiceWorkers = () => {
    // Unregister all service workers
    if ("serviceWorker" in window.navigator) {
        window.navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister();
            }
        }).catch(error => {
            console.error("Error unregistering service workers:", error);
        });
    }
};

const clearLocalStorage = () => {
    // Clear the local storage
    window.localStorage.clear();
};

const clearSessionStorage = () => {
    // Clear the session storage
    window.sessionStorage.clear();
};

const clearIndexedDB = () => {
    // Clear all IndexedDB databases:
    if (indexedDB && indexedDB.databases) {
        indexedDB.databases().then(databases => {
            databases.forEach(dbInfo => {
                indexedDB.deleteDatabase(dbInfo.name);
            });
        }).catch(error => {
            console.error("Error clearing IndexedDB:", error);
        });
    } else {
        console.warn("IndexedDB databases method is not supported in this browser.");
    }
};

const clearWebSQL = () => {
    // Clear all WebSQL databases:
    if (window.openDatabase) {
        // Assuming databases are known or can be listed somehow
        const dbs = ["db1", "db2"]; // Replace with your actual DB names or a method to retrieve them
        dbs.forEach(dbName => {
            const db = openDatabase(dbName, '1.0', '', 2 * 1024 * 1024);
            db.transaction(tx => {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {
                        const tableName = results.rows.item(i).name;
                        tx.executeSql(`DROP TABLE IF EXISTS ${tableName}`);
                    }
                });
            });
        });
    } else {
        console.warn("WebSQL is not supported in this browser.");
    }
};

const clearCookies = () => {
    // Clear all cookies, including third-party cookies
    document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
};

const clearCacheStorage = () => {
    // Clear all caches from the Cache Storage
    if ("caches" in window) {
        caches.keys().then(names => {
            for (let name of names) {
                caches.delete(name);
            }
        }).catch(error => {
            console.error("Error clearing cache storage:", error);
        });
    }
};

export {
    id,
    qs,
    qsa,
    getFileSize,
    offlineDetection,
    setCountries,
    registerServiceWorker,
    sharingLinks,
    sharingFiles,
    clearSiteData
};