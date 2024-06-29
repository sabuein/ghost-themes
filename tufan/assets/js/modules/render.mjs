"use strict";
// modules/render.mjs

const dialogControl = (identification) => {
    try {
        const dialog = document.querySelector(`dialog#${identification}`);
        const closeButton = document.querySelector(`dialog#${identification} button`);
        const showButton = document.querySelector(`dialog#${identification} + section > div > button`);
        const dialogForm = document.querySelector(`dialog#${identification} form`);

        closeButton.addEventListener("click", () => {
            dialog.close();
        });

        showButton.addEventListener("click", () => {
            dialog.showModal();
        });

        dialogForm.addEventListener("submit", () => {
            dialogForm.reset();
        });

    } catch (error) {
        console.error(error);
    }
};

export {
    dialogControl
};