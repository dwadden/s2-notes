// ==UserScript==
// @name         Semantic Scholar notes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add notes to semantic scholar.
// @match        https://www.semanticscholar.org/paper/*
// @grant        none
// ==/UserScript==


function import_simplemde() {
    // Import the SimpleMDE library: https://simplemde.com/.

    // Get the javascript. See https://stackoverflow.com/questions/19737031/loading-scripts-after-page-load.
    const tag = document.createElement("script");
    tag.src = "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"
    document.getElementsByTagName("head")[0].appendChild(tag);

    // Get the CSS. See https://stackoverflow.com/questions/30752482/fetch-css-file-after-page-loads.
    const styles = "@import url('https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');";
    const newSS=document.createElement('link');
    newSS.rel='stylesheet';
    newSS.href='data:text/css,'+escape(styles);
    document.getElementsByTagName("head")[0].appendChild(newSS);
}

function add_notes_field() {
    // Modify the HTML page source to add notes.

    // Create a literal for the HTML to insert.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    const my_html = `<div id="notes" class="card">
        <div class="card-content">
          <div class="card-content-main">
            <textarea id="note-text" name="note-text"></textarea>
          </div>
        </div>
            <button id="saveNotes" class="icon-button button--primary"><span class="cl-button__label">Save</span></button>
      </div>`;

    // Add the HTML.
    const currentDiv = document.getElementById("extracted");
    currentDiv.insertAdjacentHTML("beforebegin", my_html)

    // Convert to markdown.
    // Uses https://github.com/sparksuite/simplemde-markdown-editor.
    const simplemde = new SimpleMDE({ element: document.getElementById("note-text") });

    // Register event listener on `Save` button.
    document.getElementById("saveNotes").addEventListener("click", save_notes);
}

function load_notes() {
    // Check to see if notes exist for this document. If so, get them.
    console.log("Not implemented.");
}

function save_notes() {
    // Save notes to file.
    console.log("Not implemented.");
}

// Invoked on page load.
(function() {
    'use strict';
    window.addEventListener("load", import_simplemde);
    // Wait a bit to make sure the libraries get loaded.
    window.addEventListener("load", () => setTimeout(add_notes_field, 100));
})();
