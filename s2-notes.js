// ==UserScript==
// @name         Semantic Scholar notes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add notes to semantic scholar.
// @match        https://www.semanticscholar.org/paper/*
// @grant        none
// ==/UserScript==



function addme() {
    console.log(document.readyState);

    // Uses template literals
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    const my_html = `<div id="notes" class="card">
    <div class="card-header">
      <div class="card-header-title">
        <h4 class="card-header-title__title">Notes.</h4>
      </div>
    </div>
    <div class="card-content">
      <div class="card-content-main">
        <textarea id="note-text" name="note-text" style="box-sizing:border-box; width:100%; height:100%;">
        </textarea>
      </div>
    </div>
  </div>`;

    // Add the HTML.
    const currentDiv = document.getElementById("extracted");
    currentDiv.insertAdjacentHTML("beforebegin", my_html)
}


(function() {
    'use strict';
    window.addEventListener("load", addme)
})();
