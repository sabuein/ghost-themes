"use strict";

const id = (id) => document.getElementById(id);

const hideNav = (nav, main) => {
    let offset = 250,
        lastScrollY = 0;

    nav.onclick = () => nav.focus();
    window.addEventListener("scroll", () => {
        if (window.scrollY >= offset && window.scrollY > lastScrollY) {
            // make thin header
            nav.classList.add("loose");
            main.style.paddingTop = 0;
        } else {
            // show full header
            nav.classList.remove("loose");
            main.style.paddingTop = "5.5em";
        }
        lastScrollY = window.scrollY;
    });
};

const enableNavMenu = (nav) => {
    let solutionsElement = nav.querySelectorAll("ul.nav li"), solutionsLink = nav.querySelectorAll("ul.nav li a");
    [].forEach.call(solutionsElement, (li, index) => activateMenuItem(li, solutionsLink[index]));
};

const activateMenuItem = (item, link) => {
    item.onmouseover = () => link.focus();
    if (item.classList.contains("nav-about")) document.querySelector("ul.about-nav").onmouseleave = () => link.blur();
    // if (item.classList.contains("nav-solutions")) document.querySelector("ul.solutions-nav").onmouseleave = () => link.blur();
};

const startMainModal = (id, query) => {
    // Get the required elements for the modal
    const dialog = document.getElementById(id);
    const elements = document.querySelectorAll(query);

    // Set the show dialog elements
    elements.forEach((element) => {
        element.addEventListener("click", (event) => {
            event.preventDefault();
            dialog.showModal();
        });
    });

    // Dialog
    dialog.addEventListener("close", () => {
        if (dialog.returnValue.toLowerCase() === "cancel") return console.log("Contact form was canceled by the user.");
        if (dialog.returnValue.toLowerCase() !== "request") return false;
        console.log("Contact form has been submitted.");
        console.log("Value: ", dialog.returnValue);
        // Do something...
        // Add to input#submit oninput="this.form.elements.submit.value=this.value;"
    });
};

const shakeMe = (section) => {
    section.onmouseover = () => section.classList.add("hi");
    section.onmouseout = () => section.classList.remove("hi");
};

const deployTabs = (container) => {
    try {
        if (!container) throw new TypeError("The provided container ID is invalid.");
        const links = container.querySelectorAll("header > div > a"), tabs = container.querySelectorAll("article > hgroup");
        const activateTab = (index) => {
            resetAllTabs();
            links[index].classList.add("active");
            tabs[index].classList.add("active");
            // document.location.hash = links[index].hash;
        };

        const resetAllTabs = () => {
            links.forEach(link => link.classList.remove("active"));
            tabs.forEach(link => link.classList.remove("active"));
        };

        links.forEach((link, index) => {
            link.addEventListener("click", (e) => {
                // e.preventDefault();
                activateTab(index);
            });
        });

        activateTab(2);
    } catch (error) {
        console.error(error);
    }
};

export {
    id,
    deployTabs,
    shakeMe,
    startMainModal,
    enableNavMenu,
};