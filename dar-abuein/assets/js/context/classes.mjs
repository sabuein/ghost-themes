"use strict";

class SomeClass {
    name = "Something Good";

    register() {
        window.addEventListener("keydown", (e) => {
            this.someMethod(e);
        });
    }

    someMethod(e) {
        console.log(this.name);
        switch (e.code) {
            case "ArrowUp":
                // some code here…
                break;
            case "ArrowDown":
                // some code here…
                break;
        }
    }
}

const xxx = () => {
    const myObject = new SomeClass();
    myObject.register();
};