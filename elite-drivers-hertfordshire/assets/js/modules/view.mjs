"use strict";

const closeCookiesButton = (event) => $(event.currentTarget).parent().fadeOut(150);

//check to determine if an overflow is happening
const isOverflowing = (element) => (element.get(0).scrollWidth - element.get(0).offsetWidth) > element.scrollLeft();

const horizontalScrolling = (container, distance = 100, milliseconds = 1000) => {
    const intervalID = setInterval(() => {
        if (isOverflowing(container)) container.scrollLeft(container.scrollLeft() + distance);
        else container.scrollLeft(0);
    }, milliseconds);

    container.on("mouseenter", () => clearInterval(intervalID));
    container.on("mouseleave", () => horizontalScrolling(container, distance, milliseconds));
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

const setInputPattern = (input, type) => {
    try {
        
        let result = "";
        switch(type.trim().toLowerCase()) {
            case "password":
                result = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$`;
                break;
        }

        input.setAttribute("pattern", result);
    } catch (error) {
        console.log(error);
    }
};

const getErrorMessage = (type) => {
    try {
        switch (type.trim().toLowerCase()) {
            case "fname":
                return `Please enter your first name`;
            case "surname":
                return `Please enter your surname`;
            case "email":
                return `Please enter a valid email address`;
            case `password`:
                return `Please enter a valid password`;
        }
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

// element.scrollIntoView();

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

export {
    closeCookiesButton,
    horizontalScrolling,
    toggleBackToTopButton,
    scrollBackToTop,
};