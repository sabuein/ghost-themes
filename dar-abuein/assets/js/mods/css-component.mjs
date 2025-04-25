"use strict";
  // log("Ya sattār!", error);

/** Houdini, exists to "develop features that explain the 'magic' of styling and layout on the web". */

/** The CSS paint() function is an additional function supported by the <image> type. It takes parameters that include the name of the worklet, plus additional parameters needed by the worklet. The worklet also has access to the element's custom properties: they don't need to be passed as function arguments. */
class CheckerboardPainter {
    paint(ctx, geom, properties) {
      // Use `ctx` as if it was a normal canvas
      const colors = ["red", "green", "blue"];
      const size = 32;
      for (let y = 0; y < geom.height / size; y++) {
        for (let x = 0; x < geom.width / size; x++) {
          const color = colors[(x + y) % colors.length];
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.rect(x * size, y * size, size, size);
          ctx.fill();
        }
      }
    }
  }
  

// In the following example the paint() function is passed a worklet called myComponent.
/*
li {
  background-image: paint(myComponent, stroke, 10px);
  --highlights: blue;
  --theme: green;
}
*/

  // Register our class under a specific name
  registerPaint("checkerboard", CheckerboardPainter);  

  const animatingCustomProperties = () => {

    /*
    The same registration can take place in CSS.
    @property --stop-color {
  syntax: "<color>";
  inherits: false;
  initial-value: blue;
}

    */
    window.CSS.registerProperty({
        name: '--stop-color',
        syntax: '<color>',
        inherits: false,
        initialValue: 'blue',
      });

      /*
      button {
  --stop-color: red;
  transition: --stop-color 1s;
}

button:hover {
  --stop-color: green;
}
      */
  };