// ==UserScript==
// @name         Semantic Scholar notes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add notes to semantic scholar.
// @match        https://www.semanticscholar.org/paper/*
// @grant        none
// ==/UserScript==


function printme() {
    console.log("I'm running");
}


function addme() {
    console.log("Inserting stuff");

    console.log(document.readyState);

    const newDiv = document.createElement("div");
    newDiv.id = "notes"

    // and give it some content
    const newContent = document.createTextNode("Hi there and greetings!");

    // add the text node to the newly created div
    newDiv.appendChild(newContent);

    // add the newly created element and its content into the DOM
    const currentDiv = document.getElementById("extracted");
    currentDiv.parentNode.insertBefore(newDiv, currentDiv);
}


(function() {
    'use strict';
    window.addEventListener("load", addme)
})();
