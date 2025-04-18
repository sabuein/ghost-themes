"use strict";

// js/pwa.js

// JavaScript files are compiled and minified during the build process to the assets/built folder. See available scripts in the package.json file.

// Import CSS
// import sheet from "../css/screen.css" assert { type: 'css' };

// Dynamically imported stylesheets
/*
const cssModule = await import("../css/screen.css", {
    assert: { type: "css" }
});
document.adoptedStyleSheets = [cssModule.default]; // instead of [sheet];
shadowRoot.adoptedStyleSheets = [cssModule.default];
*/

// Import JS
import { registerServiceWorker } from "web";
import menuOpen from "./extra/menuOpen.js";
import infiniteScroll from "./extra/infiniteScroll.js";

registerServiceWorker();

// Call the menu and infinite scroll functions
menuOpen();
infiniteScroll();