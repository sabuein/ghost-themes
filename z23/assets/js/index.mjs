import { doFakePages, getNetworkInfo, reveal, toggled } from "nav";

document.addEventListener("DOMContentLoaded", (event) => {
    doFakePages();
    getNetworkInfo();
    toggled("button#menuToggle", 'ul[role="menu"]');
    //registerPrevious(document.activeElement);
    window.addEventListener("scroll", () => reveal(".category-item"));
    /*let all = document.querySelectorAll("body *");
    all.forEach(ele => {
        ele.addEventListener("blur", (event) => {
            console.log(event.target);
        });
    });*/
});

/*
var options = {
    root: document.getElementById("maincontent"),
    rootMargin: "0px",
    threshold: 1.0
};

const doThis = () => {
    console.log(target);
}

var observer = new IntersectionObserver(doThis, options);

var target = document.querySelector("article.category-item");
observer.observe(target);
*/