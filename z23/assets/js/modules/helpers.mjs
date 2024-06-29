"use strict";

const id = (id) => document.getElementById(id);

const explainError = (error) => {
    console.error(error);
};

export { explainError, id };