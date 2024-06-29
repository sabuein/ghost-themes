"use strict";

import {
    id,
    deployTabs,
    shakeMe,
    startMainModal,
    enableNavMenu,
} from "./modules/view.mjs";

const xx = (cont) => {
    return window.setInterval(() => {
        cont.forEach((container) => {
            const width = container.scrollWidth;
            if (container.scrollLeft !== width) {
                container.scrollTo(container.scrollLeft * 1.25 + 1, 0);
            } else {
                self.setInterval(() => {
                    container.scrollTo(container.scrollLeft * 1.25 + -1, 0);
                }, 15);
            }
        });
    }, 15);
};

// Automatically scroll horizontally when the window load
window.addEventListener("load", () => {
    try {
        // const sections = document.querySelectorAll("main > section") || null;
        // sections.forEach((section) => shakeMe(section));
        const containers = document.querySelectorAll(".horizontal-scrollingXXX") || null;
        //xx(containers);

        const captions = document.getElementById("rapid-captions-auto");
        if (!!captions) {
            console.log("Yallah...");
            simulation(captions);
        }

        const externalLinks = document.querySelectorAll(`a[href^="http"]:not([href^="https://rapid-is"])`);
        if (window.location.hostname !== "localhost") externalLinks.forEach(link => {
            link.target = "_blank";
            link.rel = "noopener";
        });

        const trigram = document.querySelector(`header [data-html-symbol="trigram-for-heaven"]`);
        const mainMenu = document.querySelector(`header nav.flexy`);

        const aboutMenu = document.querySelector(`header ul.about-nav`);
        const aboutButton = document.querySelector(`header ul.nav.flexy li:first-child a`);

        const solutionsMenu = document.querySelector(`header ul.solutions-nav`);
        const solutionsButton = document.querySelector(`header ul.nav.flexy li:nth-child(3) a`);

        const openMainMenu = () => {
            trigram.style.rotate = "90deg";
            mainMenu.style.display = "flex";
            document.body.style.overflowY = "hidden";
        };

        const closeMainMenu = () => {
            trigram.style.rotate = "none";
            mainMenu.style.display = "none";
            document.body.style.overflowY = "auto";
        };

        trigram.addEventListener("click", (event) => {
            if (event.target === trigram) {
                openMainMenu();
            }
        });

        mainMenu.addEventListener("click", (event) => {
            if (event.target === mainMenu) {
                closeMainMenu();
            }
        });

        aboutButton.addEventListener("click", (event) => {
            // event.preventDefault();
            aboutMenu.style.display = "flex";
            aboutMenu.addEventListener("click", () => aboutMenu.style.display = "none", false);
        });

        solutionsButton.addEventListener("click", (event) => {
            // event.preventDefault();
            solutionsMenu.style.display = "flex";
            solutionsMenu.addEventListener("click", () => solutionsMenu.style.display = "none", false);
        });

        document.addEventListener("keydown", (event) => {
            if (event.code === "Escape") {
                aboutMenu.style.display = "none";
                solutionsMenu.style.display = "none";
                closeMainMenu();
            }
        }, false);

    } catch (error) {
        console.error(error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if ("virtualKeyboard" in window.navigator) window.navigator.virtualKeyboard.overlaysContent = true;
    // Get the contact main nav item
    startMainModal("get-in-touch", ".show-modal");
    /*const getInTouchLinks = document.querySelectorAll(`a[href$="/contact/" i]`) || null;
    if (!!getInTouchLinks) {
        getInTouchLinks.forEach(link => link.classList.add("show-modal"));
        startMainModal("get-in-touch", ".show-modal");
    }*/

    const nav = document.querySelector("body > header > nav");
    if (!!nav) enableNavMenu(nav);

    const goToTopLinks = document.querySelectorAll(`a[href*="main-content"]`);
    if (!!goToTopLinks) goToTopLinks.forEach(link => link.addEventListener("click", () => setTimeout(() => window.scrollTo(0, 0), 0)));

    const cookiesAside = document.querySelector("aside.cookies");
    const cookiesActions = document.querySelectorAll("aside.cookies > form.actions");
    cookiesActions.forEach((input) => {
        const accepted = window.localStorage.getItem("cookiesAccepted") || null;
        if (!accepted || accepted !== "true") {
            cookiesAside.style.display = "flex";
            input.addEventListener("click", () => {
                window.localStorage.setItem("cookiesAccepted", true);
                cookiesAside.style.display = "none";
            });
        }
    });

    // Let the whole solution widget clickable!
    const solutionsApps = document.querySelectorAll("body.tag-template.tag-solutions>main#main-content>#apps>article") || null;
    if (!!solutionsApps) {
        for (let i = 0; i < solutionsApps.length; i++) {
            const a = document.querySelector(`body.tag-template.tag-solutions>main#main-content>#apps>article:nth-child(${i + 1})>hgroup>a`);
            solutionsApps[i].onclick = () => a.click();
        }
    }

    const tabs = id("tabs-about");
    if (!!tabs) deployTabs(tabs);

    const testimonials = id("client-testimonials");
    if (!!testimonials) {
        const circles = testimonials.querySelectorAll("ol li");
        const quotes = testimonials.querySelectorAll("blockquote");

        const activateCurrent = (index) => {
            if (index >= quotes.length) currentIndex = 0;
            else if (index < 0) currentIndex = quotes.length - 1;
            else currentIndex = index;
            deactivateAll();
            circles[currentIndex].classList.add("currently-active");
            quotes[currentIndex].classList.add("currently-active");
        };

        const deactivateAll = () => {
            quotes.forEach(quote => quote.classList.remove("currently-active"));
            circles.forEach(circle => circle.classList.remove("currently-active"));
        };

        let currentIndex = 0;
        activateCurrent(currentIndex);

        const activateArrow = (index) => activateCurrent(currentIndex += index);

        const autoPlay = setInterval(() => document.querySelector(".next-testimonial").click(), 5000);
        const activateTestimonialsPanel = () => {
            try {
                quotes.forEach(quote => quote.addEventListener("mouseenter", () => clearInterval(autoPlay), { once: true }));
                circles.forEach((circle, index) => circle.addEventListener("click", () => activateCurrent(index)));

                document.querySelector(".next-testimonial").addEventListener("click", (e) => {
                    e.preventDefault();
                    activateArrow(+1);
                });

                document.querySelector(".prev-testimonial").addEventListener("click", (e) => {
                    e.preventDefault();
                    activateArrow(-1);
                });
            } catch (error) {
                console.error(error);
            }
        };

        activateTestimonialsPanel();
    }
});

const simulation = (parent) => {
    const x = document.querySelector("#rapid-captions-auto > figure > svg");
    const ttt = x.querySelectorAll("#icon path");
    ttt.forEach(y => {
        y.tabIndex = 0;
        y.addEventListener("click", () => {
            ttt.forEach(y => y.classList.remove("active"));
            clearInterval(playing);
            y.classList.add("active");
        });
    });
    /*ttt[0].classList.add("active");*/
    console.log("Done");
    setTimeout(() => {
        ttt[0].classList.add("active");
    }, 1000);;
    let index = 1;
    const playing = setInterval(() => {
        ttt.forEach(y => y.classList.remove("active"));
        ttt[index].classList.add("active");
        index++;
        if (index === 6) index = 0;
    }, 6000);
};