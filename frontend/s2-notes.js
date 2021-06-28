// ==UserScript==
// @name         Semantic Scholar notes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add notes to semantic scholar.
// @match        https://www.semanticscholar.org/paper/*
// @grant        none
// ==/UserScript==


// TODO(dwadden) Add some checks to make sure the S2ID remains consistent over time.
// TODO(dwadden) Auto-save or save check?


function import_simplemde() {
    // Import the SimpleMDE library: https://simplemde.com/.

    // Get the javascript. See https://stackoverflow.com/questions/19737031/loading-scripts-after-page-load.
    const tag = document.createElement("script");
    tag.src = "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"
    document.getElementsByTagName("head")[0].appendChild(tag);

    // Mathjax. This is from here: https://gist.github.com/chooco13/c280c1cc6584c97af85307028ecaebb1.
    // I tried using a V3 of MathJax, but it didn't work.
    const mathjax = document.createElement("script");
    mathjax.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML";
    document.getElementsByTagName("head")[0].appendChild(mathjax);

    // Get the CSS. See https://stackoverflow.com/questions/30752482/fetch-css-file-after-page-loads.
    const styles = "@import url('https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css');";
    const newSS = document.createElement('link');
    newSS.rel = 'stylesheet';
    newSS.href = 'data:text/css,' + escape(styles);
    document.getElementsByTagName("head")[0].appendChild(newSS);
}

function add_notes_field() {
    // Modify the HTML page source to add notes.

    // Create a literal for the HTML to insert.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    const my_html = `
        <div id="notes" class="card">
          <div class="card-content" style="padding: 20px;">
            <div class="card-content-main" style="padding: 0px;">
              <textarea id="note-text" name="note-text"></textarea>
              <div class="pagination" style="padding: 0px;">
                <button id="saveNotes" class="icon-button button--primary"><span class="cl-button__label">Save</span></button>
              </div>
            </div>
          </div>
        </div>`;

    // Add the HTML.
    let currentDiv = document.getElementById("extracted");
    if (currentDiv === null) {
        // Deal with the case where there's no extracted figures (happens
        // sometimes.)
        currentDiv = document.getElementById("citing-papers");
    }
    currentDiv.insertAdjacentHTML("beforebegin", my_html)

    // MathJax config from
    // https://gist.github.com/chooco13/c280c1cc6584c97af85307028ecaebb1.
    MathJax.Hub.Config({
        tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]}
    });

    // Convert to markdown.
    // Uses https://github.com/sparksuite/simplemde-markdown-editor.
    window.simplemde = new SimpleMDE({
        element: document.getElementById("note-text"),
        spellChecker: false,
        previewRender: function(plainText) {
            var preview = document.getElementsByClassName("editor-preview-side")[0];
            preview.innerHTML = this.parent.markdown(plainText);
            preview.setAttribute('id','editor-preview')
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,"editor-preview"]);
            return preview.innerHTML;
        }
    });

    // Register event listener on `Save` button.
    document.getElementById("saveNotes").addEventListener("click", save_notes);

    // Load notes.
    load_notes();
}

function get_document_info() {
    // Get S2 ID and title from the webpage.
    try {
        const paper_id = parseInt(document.querySelector('[data-selenium-selector="corpus-id"]').innerText.split(": ")[1]);
        const title = document.querySelector('[name="citation_title"]').content;
        const author = document.querySelector('[name="citation_author"]').content;
        const doi_elem = document.querySelector('[class="doi__link"]');
        const doi = doi_elem.textContent;
        const doi_link = doi_elem.href;
        return {
            "paper_id": paper_id,
            "doi": doi,
            "doi_link": doi_link,
            "title": title,
            "author": author,
            "timestamp": Date.now()
        }
    } catch (e) {
        alert("Unable to get document info from page");
        return null;
    }
}

function load_notes() {
    // Check to see if notes exist for this document. If so, get them.
    const document_info = get_document_info();
    if (document_info === null) {
        // If there was a problem getting document info, just return.
        return
    }
    // Send a get request.
    const paper_id = document_info.paper_id;
    const request = `http://127.0.0.1:5000/GetNotes/${paper_id}`;

    // Send a get request using `fetch` and populate.
    fetch(request, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            window.simplemde.value(data.notes);
        })
        .catch((error) => {
            alert("Failed to load file.");
            console.error('Error:', error);
        });
}

function save_notes() {
    // Save notes to file.
    const document_info = get_document_info();
    if (document_info === null) {
        // If there was a problem getting document info, just return.
        return
    }
    const notes = {"notes": window.simplemde.value()};

    // Merge document info together with notes.
    const data = {
        ...document_info,
        ...notes
    }

    // Send a post request using `fetch`.
    const request = "http://127.0.0.1:5000/SetNotes"
    fetch(request, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            alert("Failed to save file.");
            console.error('Error:', error);
        });
}

// Invoked on page load.
(function () {
    'use strict';
    window.addEventListener("load", import_simplemde);
    // Wait a bit to make sure the libraries get loaded.
    window.addEventListener("load", () => setTimeout(add_notes_field, 200));
})();
