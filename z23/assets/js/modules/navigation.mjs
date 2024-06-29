"use strict";

import { explainError, id } from "help";

const getHistory = (event) => {
    try {
        const numberOfEntries = history.length;
        
        console.log(`Total number of entries: ${numberOfEntries}`);
        console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
        
        history.pushState({ page: 1 }, "title 1", "?page=1");
        history.pushState({ page: 2 }, "title 2", "?page=2");
        history.replaceState({ page: 3 }, "title 3", "?page=3");
        history.back(); // Logs "location: http://example.com/example.html?page=1, state: {"page":1}"
        history.back(); // Logs "location: http://example.com/example.html, state: null"
        history.go(2); // Logs "location: http://example.com/example.html?page=3, state: {"page":3}"
          

    } catch (error) {
        explainError(error);
    }
    /*
    history.back();
    history.forward();

    // Moving to a specific point in history
    history.go(-1); // the equivalent of calling back();
    history.go(1); // the equivalent of calling forward();

    // refreshing the page
    history.go(0);
    history.go();

    // The history stack
    history.replaceState();
    history.pushState();
    */
};

const doFakePages = () => {
    try {
        window.onpopstate = (event) => setTimeout(getHistory(event), 0);
    } catch (error) {
        explainError(error);
    }
};

const getNetworkInfo = () => {
    try {
        let type = navigator.connection.effectiveType;
        const updateConnectionStatus = () => {
            console.log(`Connection type changed from ${type} to ${navigator.connection.effectiveType}`);
            type = navigator.connection.effectiveType;
        };
        navigator.connection.addEventListener("change", updateConnectionStatus);
    } catch (error) {
        explainError(error);
    }
};

const topFunction = () => {
    try {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    } catch (error) {
        explainError(error);
    }
};

const scrollFunction = () => {
    try {
        // Get the button:
        const mybutton = document.getElementById("goTopBtn");
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            mybutton.style.display = "block";
            setTimeout(() => {
                mybutton.style.opacity = "1";
                mybutton.style.transition = "opacity 1s .1s ease";
            }, 100);
        } else {
            mybutton.style.opacity = "0";
            mybutton.style.transition = "opacity 1s .25s ease";
            setTimeout(() => {
                mybutton.style.display = "none";
            }, 100);
        }
        // When the user clicks on the button, scroll to the top of the document
        mybutton.onclick = topFunction;
    } catch (error) {
        explainError(error);
    }
};

const goTop = () => {
    try {
        // When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = scrollFunction;
    } catch (error) {
        explainError(error);
    }
}

const reveal = (querySelector) => {
    try {
        const elements = document.querySelectorAll(querySelector);
        elements.forEach((element, index) => {
            const winHeight = window.innerHeight,
                elementTop = element.getBoundingClientRect().top,
                breakpoint = 140;

            let equation = elementTop < winHeight - breakpoint;
            (equation) ? element.classList.add("magic") : element.classList.remove("magic");
        });
    } catch (error) {
        explainError(error);
    }
};

const previousElement = () => {
    let x = document.activeElement;
    return x;
}

const checkEscape = (trigger, target) => {
    try {
        target.addEventListener("keydown", (event) => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            } else if (event.key === "Escape" || event.keyCode === 27) {
                // Escape code, check https://www.toptal.com/developers/keycode for more
                trigger.click();
            }
        });
    } catch (error) {
        explainError(error);
    }
};

const toggled = (trigger, target) => {
    try {
        const button = document.querySelector(trigger), menu = document.querySelector(target);
        button.addEventListener("click", () => {
            //menu.classList.toggle("toggled");
            if (menu.classList.contains("toggled")) {
                menu.classList.remove("toggled");
                button.style.rotate = "none";
                document.activeElement.blur();
            } else {
                menu.classList.add("toggled");
                button.style.rotate = "90deg";
                menu.focus();
            }
            button.addEventListener("blur", (event) => {
                menu.focus();
                event.stopPropagation();
            });
        });
        checkEscape(button, menu);
    } catch (error) {
        explainError(error);
    }
};

const showPopup = (elementId) => {
    try {
        const popup = id(`${elementId}`),
            popupOpen = id(`${elementId}-open`),
            popupClose = id(`${elementId}-close`),
            popupConfirm = id(`${elementId}-confirm`),
            popupOutput = id(`${elementId}-output`);
            
        
        // "Confirm" button triggers "close" on dialog because of [formmethod="dialog"]
        popup.addEventListener("close", (e) => {
            // Have to check for "default" rather than empty string
            if (e.target.returnValue !== "") {
                popupOutput.value = e.target.returnValue === "default" ? "No select value." : `Selected: ${e.target.returnValue}.`;
                return false;
            } else {
                popupOutput.value = "";
            }
        });
        
        // "Favorite animal" input sets the value of the submit button
        const selectEl = popup.querySelector("select");
        
        selectEl.addEventListener("change", (e) => {
            popupConfirm.value = selectEl.value;
        });

        popupConfirm.addEventListener("click", (event) => {
            event.preventDefault();
            // We don't want to submit this fake form
            popup.close(selectEl.value); // Have to send the select box value here.
        });

        // Auto popup after 3 seconds
        // setTimeout(() => popup.showModal(), 3000);

        popupOpen.addEventListener("click", (event) => {
            event.preventDefault();
            popup.showModal();
        });
        popupClose.addEventListener("click", (event) => {
            event.preventDefault();
            popup.close("");
        });

        makeDraggable(popup);

    } catch (error) {
        explainError(error);
    }
};

const makeDraggable = (element) => {
    element.addEventListener("dragstart", handleDragStart);
    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("dragenter", handleDragEnter);
    element.addEventListener("dragleave", handleDragLeave);
    element.addEventListener("dragend", handleDragEnd);
    element.addEventListener("drop", handleDrop);
};

const handleDrop = (e) => {
    try {
        e.stopPropagation(); // stops the browser from redirecting
        /*if (dragSrcEl !== e.target) {
            dragSrcEl.innerHTML = e.target.innerHTML;
            e.target.innerHTML = e.dataTransfer.getData("text/html");
        };*/
        return false;
    } catch (error) {
        explainError(error);
    }
};

//let dragSrcEl;
const handleDragStart = (e) => {
    try {
        //dragSrcEl = e.target;
        const item = e.target;
        item.style.opacity = ".5";
        item.style.transition = "opacity 1s 0 ease";
        /*item.dataTransfer.effectAllowed = "move";
        item.dataTransfer.setData("text/html", item.innerHTML);*/
    } catch (error) {
        explainError(error);
    }
};

const handleDragEnd = (e) => {
    try {
        e.target.style.opacity = "1";
        e.target.style.transition = "opacity 1s 0 ease";
    } catch (error) {
        explainError(error);
    }
};

const handleDragOver = (e) => {
    try {
        e.preventDefault(); // Which sets the dataTransfer.dropEffect property to "none"
        return false;
    } catch (error) {
        explainError(error);
    }
};

const handleDragEnter = (e) => {
    try {
        e.target.classList.add("over");
    } catch (error) {
        explainError(error);
    }
};

const handleDragLeave = (e) => {
    try {
        e.target.classList.remove("over");
    } catch (error) {
        explainError(error);
    }
};

const getIndeterminateInputs = () => {
    try {
        // Activating input:indeterminate + label { background: lime; }
        const inputs = document.getElementsByTagName("input");
        inputs.forEach(input => input.indeterminate = true);
    } catch (error) {
        explainError(error);
    }
}

const fixBrokenImages = () => {
    try {
        // Activating input:indeterminate + label { background: lime; }
        const images = document.getElementsByTagName("img");
        for (let image of images) {
            image.addEventListener("error", () => image.style.opacity = "0");
        }
    } catch (error) {
        explainError(error);
    }
}

export {
    doFakePages,
    getNetworkInfo,
    reveal,
    toggled,
    showPopup
};