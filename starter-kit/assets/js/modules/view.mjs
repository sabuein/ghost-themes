"use strict";

const closeCookiesButton = (event) => $("#cookies").fadeOut(150);

//check to determine if an overflow is happening
const isOverflowing = (element) => (element.get(0).scrollWidth - element.get(0).offsetWidth) > element.scrollLeft();

const horizontalScrolling = (container = null, distance = 100, milliseconds = 1000) => {
    if (!!container) {
        const intervalID = setInterval(() => {
            if (isOverflowing(container)) container.scrollLeft(container.scrollLeft() + distance);
            else container.scrollLeft(0);
        }, milliseconds);

        container.on("mouseenter", () => clearInterval(intervalID));
        container.on("mouseleave", () => horizontalScrolling(container, distance, milliseconds));
    } else false;
};

// When the user scrolls down 150px from the top of the document, show the button
const toggleBackToTopButton = (button) => {
    try {
        if (window.document.body.scrollTop > 150 || window.document.documentElement.scrollTop > 150) {
            button.style.visibility = "visible";
            // button.focus();
        } else {
            button.style.visibility = "hidden";
            button.blur();
        }
    } catch (error) {
        console.log(error);
    }
};

const scrollBackToTop = (event) => {
    try {
        event.preventDefault();
        window.document.body.scrollTop = 0; // For Safari
        window.document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        return false;
    } catch (error) {
        console.log(error);
    }
};

const detectCapsLockOn = (input) => {
    try {
        const text = document.createElement("p");
        text.classList.add("warning");
        text.textContent = "WARNING! Caps lock is ON.";

        input.addEventListener("keyup", (event) => {
            if (event.getModifierState("CapsLock")) document.appendChild(text);
            else document.querySelectorAll("p.warning").forEach((item) => item.remove());
        });

    } catch (error) {
        console.log(error);
    }
};

const copyTextToClipboard = (copyText) => {
    try {
        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);
        
        // Alert the copied text
        alert("Copied the text: " + copyText.value);
    } catch (error) {
        console.log(error);
    }
};

const pauseVideo = (video, button) => {
    // Pause and play the video, and change the button text
    try {
        if (video.paused) {
            video.play();
            button.innerHTML = "Pause";
        } else {
            video.pause();
            btn.innerHTML = "Play";
        }
    } catch (error) {
        console.log(error);
    }
};

const includeHTML = () => {
    // Add <div w3-include-html="content.html"></div>
    try {
        let z, i, elmnt, file, xhttp;
        /* Loop through a collection of all HTML elements: */
        z = document.getElementsByTagName("*");
        for (i = 0; i < z.length; i++) {
            elmnt = z[i];
            /*search for elements with a certain atrribute:*/
            file = elmnt.getAttribute("w3-include-html");
            if (file) {
                /* Make an HTTP request using the attribute value as the file name: */
                xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                        if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                        /* Remove the attribute, and call this function once more: */
                        elmnt.removeAttribute("w3-include-html");
                        includeHTML();
                    }
                }
                xhttp.open("GET", file, true);
                xhttp.send();
                return false;
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const setupDialogs = () => {
    try { // body inert
        const dialogs = document.querySelectorAll("dialog"),
            showButtons = document.querySelectorAll("dialog + button"),
            closeButtons = document.querySelectorAll("dialog > button"),
            submitButtons = document.querySelectorAll("dialog > button"),
            outputs = document.querySelectorAll("*.modal > output");

        dialogs.forEach((dialog, index, arr) => {
            dialog.addEventListener("close", (event) => {
                window.document.body.style.overflow = "auto";
                event.preventDefault();

                if (dialog.returnValue === "cancel") {
                    console.log(dialog?.returnValue);
                } else if (dialog.returnValue === "confirm") {
                    console.log(dialog?.returnValue);
                }

                outputs[index].textContent = dialog.returnValue;
                dialogs[index].querySelector("form")?.reset();

                showButtons[index].scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
                showButtons[index].focus();
            });

            dialog.addEventListener("cancel", (event) => {
                event.preventDefault();
                dialogs[index].close();
            });
        });

        showButtons.forEach((button, index, arr) => button.addEventListener("click", () => {
            window.document.body.style.overflow = "hidden";
            dialogs[index].showModal();
            dialogs[index].querySelector("form")?.scrollIntoView();
        }));

        closeButtons.forEach((button, index, arr) => button.addEventListener("click", () => dialogs[index].close()));
        
        submitButtons.forEach((button, index, arr) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                dialogs[index].close();
            });
        });

    } catch (error) {
        console.log(error);
    }
};

const showSubMenu = (triggerSelector, menuSelector) => {
    const trigger = document.querySelector(`${triggerSelector} > a`),
        menu = document.querySelector(menuSelector);
    
    /*
    trigger.addEventListener("mouseenter", (e) => menu.style.display = "flex");
    trigger.addEventListener("mouseleave", (e) => menu.style.display = "none");
    */

    trigger.addEventListener("click", (event) => {
        event.preventDefault();  // Prevent the default link behavior
        menu.classList.toggle("visible");
    });

    trigger.addEventListener("dblclick", (event) => {
        window.location.assign(trigger.getAttribute("href"));
    });

    // Optional: Close the sub-nav when clicking outside
    document.addEventListener("click", (event) => {
        if (!trigger.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.remove("visible");
        }
    });
};

export {
    closeCookiesButton,
    horizontalScrolling,
    toggleBackToTopButton,
    scrollBackToTop,
    setupDialogs,
    showSubMenu
};