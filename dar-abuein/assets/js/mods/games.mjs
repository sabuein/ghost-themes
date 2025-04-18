"use strict";

import { createElement } from "interface";

const startGame = () => {
    const myGameArea = {
        canvas: createElement("canvas", {
            style: {
                width: 480,
                height: 270
            }
        }),
        start: function () {
            this.context = this.canvas.getContext("2d");
            console.log("Inserting the game area...");
            document.body
                .querySelector("main")
                .insertBefore(
                    this.canvas,
                    document.body.querySelector("main").childNodes[0]
                );
        },
    };

    // Make the body load this <body onload="startGame()">
    myGameArea.start();
};

export { startGame };