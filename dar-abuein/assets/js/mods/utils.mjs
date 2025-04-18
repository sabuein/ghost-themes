"use strict";

import { createElement } from "interface";

const log = (...value) => console.log(...value);

const getClock = () => {
    const now = new Date();
    const timeZones = Intl.supportedValuesOf("timeZone");
    function updateTime() {
        

        timeZones.forEach(timeZone =>
            {
              const time = now.toLocaleString("en-GB", { timeZone: `${timeZone}` });
              console.log(timeZone, time);
            });
      
        let now_india = now.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "medium",
          timeZone: "Asia/Kolkata"
        });
        document.querySelector("p.india").innerText = now_india;
      
        let now_sydney = now.toLocaleString("en-AU", {
          dateStyle: "medium",
          timeStyle: "medium",
          timeZone: "Australia/Sydney"
        });
        document.querySelector("p.aus").innerText = now_sydney;
      
        let now_new_york = now.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "medium",
          timeZone: "America/New_York"
        });
        document.querySelector("p.us").innerText = now_new_york;
      }

updateTime();

setInterval(updateTime, 1000);
};

const AUDIO_EXT = [".wav", ".mp3", ".mp4", ".aac", ".flac", ".ogg", ".webm"];
const AUDIO_MIME = [
    "audio/wav",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp4",
    "audio/aac",
    "audio/flac",
    "audio/ogg",
    "application/ogg",
    "audio/webm",
];

/** Given a time in seconds, return a string in the format MM:SS. */
const formatTime = (time) => {
    if (time === -1) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
    }${seconds}`;
};

// Get today's date and time, formatted as YYYY-MM-DD HH:MM:SS.
const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const seconds = today.getSeconds();
    return `${year}-${month < 10 ? "0" : ""}${month}-${
        day < 10 ? "0" : ""
    }${day} ${hour < 10 ? "0" : ""}${hour}:${minute < 10 ? "0" : ""}${minute}:${
        seconds < 10 ? "0" : ""
    }${seconds}`;
};

// Get a somewhat unique ID.
const getUniqueId = () => {
    let id = "";
    id += "abcdefghijklmnopqrstuvwxyz".split("")[
        Math.floor(Math.random() * 26)
    ];
    id += "abcdefghijklmnopqrstuvwxyz".split("")[
        Math.floor(Math.random() * 26)
    ];
    id += "0123456789".split("")[Math.floor(Math.random() * 10)];
    id += "0123456789".split("")[Math.floor(Math.random() * 10)];
    return (id += Date.now());
};

// Using the FileSystem Access API, open a file picker and return the selected file(s).
const openFilesFromDisk = async () => {
    if (!("showOpenFilePicker" in window)) {
        return await legacyOpenFilesFromDisk();
    }

    // TODO: how to allow selecting a folder?
    const handles = await window.showOpenFilePicker({
        multiple: true,
        types: [
            {
                description: "Audio files",
                accept: {
                    "audio/*": AUDIO_EXT,
                },
            },
        ],
    });

    const files = [];
    for (const handle of handles) {
        const file = await handle.getFile();
        if (file.type.startsWith("audio/")) {
            files.push(file);
        }
    }

    return files;
};

const legacyOpenFilesFromDisk = () => {
    // Create an input type file element.
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = [...AUDIO_EXT, ...AUDIO_MIME].join(",");

    // Simulate a click on the input element.
    const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });
    input.dispatchEvent(event);

    // Wait for the file to be selected.
    return new Promise((resolve) => {
        input.onchange = (event) => {
            resolve(event.target.files);
        };
    });
};

// Given a string with at least one dot and some text after it, return the part between the start of the string and the last dot.
const getFileNameWithoutExtension = (fileName) =>
    fileName.split(".").slice(0, -1).join(".");

const cookieValue = (key) =>
    document.cookie
        .split("; ")
        .map((row) => row.split("="))
        .find(([cookieKey]) => cookieKey === key)?.[1];

const cookieValueURLEncoded = (key) =>
    document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${key}=`))
        ?.split("=")[1] && decodeURIComponent(value);


// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i)
        outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
};

const read = (href) => {
    
};

const fillTableWithParameters = () => {
    const { href, origin, pathname } = window.location,
    container = createElement("div", { className: "flexy" }),
    table = createElement("table", {}),
    tfoot = createElement("tfoot", {}),
    tr = createElement("tr", {}),
    testing = createElement("a", {
        href: `./?from=abuein&excitement=high&likelihood=inconceivable`,
        title: "Test this!",
        textContent: "Test this!"
}),
    url = new URL(document.location.href);

    url.searchParams.sort();
    const keys = url.searchParams.keys();
  
    for (const key of keys) {
      const val = url.searchParams.get(key),
      row = createElement("tr", {}),
      cell1 = createElement("td", {
        textContent: key
      }),
      cell2 = createElement("td", {
        textContent: val
      });

      row.append(cell1, cell2);
      table.appendChild(row);
    }

    tr.appendChild(createElement("td", {
        colspan: 2,
        innerHTML: testing.outerHTML
    }));
    
    tfoot.appendChild(tr);
    table.appendChild(tfoot);
    container.append(createElement("p", {
        textContent: "Testing out the URL API. Try loading this page with different parameter lists."
    }), table);
    
    document.body.appendChild(container);
  };
/** Access the system clipboard in order to read text contents from the clipboard. */
  const readTextClipboard = async () => {
    const clipText = await navigator.clipboard.readText();
  if (clipText) document.querySelector(".clip-text").innerText = clipText;
  };

/** This function reset height to auto to calculate new height, then sets height to scrollHeight. */
const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
};

const copyToClipboard = (sourceElement) => {
    /*
    textarea.select();
    document.execCommand("copy");
    */
    // Copy the text inside the text field
    navigator.clipboard.writeText(sourceElement.textContent);
    alert("Text copied to clipboard!");
};

export {
    log,
    formatTime,
    getFormattedDate,
    getUniqueId,
    openFilesFromDisk,
    legacyOpenFilesFromDisk,
    getFileNameWithoutExtension,
    cookieValue,
    urlBase64ToUint8Array,
    fillTableWithParameters,
    autoResizeTextarea,
    copyToClipboard
};
