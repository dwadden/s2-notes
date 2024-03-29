# Semantic Scholar notes

Do you use Semantic Scholar? Do you take notes when you read papers? This repo enables you to write and view your paper notes without leaving Semantic Scholar, like so:

<img src="img/example.png" alt="example" width="600"/>

It adds a notes section below the main information section on each paper. It supports Markdown as well as Mathjax. The notes are stored locally on your machine as `.json` files, in a directory of your choosing.

## Outline

- [Setup](#setup)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Feature additions](#feature-additions)
- [Storage details](#storage-details)
- [Acknowledgments](#acknowledgments)

## Setup

This should work with Google Chrome, running on Mac:

- Clone the repo and navigate to the repo's top-level directory.
- Set up your Python environment. This can be done using `conda`:
  ```
  conda create --name s2-notes python=3.9
  conda activate s2-notes
  pip install -r requirements.txt
  ```
- Set the environment variable `S2_NOTES_DIR`, and create a directory at this location. Your notes will be saved as files in `S2_NOTES_DIR`. You can add a line like this to your `.bashrc` or `.bash_profile`:
  ```
  export S2_NOTES_DIR=[your-notes-go-here]
  ```
- Install [Tampermonkey](https://www.tampermonkey.net) for Chrome.
- Create a new blank Tampermonkey script. Copy the contents of [frontend/s2-notes.js](frontend/s2-notes.js) into the Tampermonkey script, and save the script.
  - See the Tampermonkey docs for information on how to create and activate a script.
- In a terminal window, navigate to the `backend` subdirectory of this repo and enter `bash run.sh`. The server should start.

## Usage

Once you've got the Tampermonkey script installed and the backend server running, you should see a notes window like the one in the image above, for every article page on Semantic Scholar. Two caveats:

- When you navigate to a new paper, you may need to refresh the page in order for the notes section to show up.
- Make sure to *save your notes* by clicking the `Save` button (at the bottom left in the example above). Notes will not save automatically.

More details in the [feature additions](#feature-additions) section below.

## Troubleshooting

I can only offer support for Chrome on Mac. In general, if you don't see a notes section, try reloading the page.

- If you see a text box for your notes, but it's very small and doesn't have any Markdown formatting, it's probably because the required libraries didn't load in time. Just refresh the page and it should work.

Otherwise, feel free to open an issue, including logs from both:

- The JavaScript console.
- The Flask backend server.

## Feature additions

I am very much a web programming amateur, so I did my best to hack something together, but I would definitely accept PR's. In particular:

- A PR so that you don't have to reload the page in order for the notes to show up. Right now, I'm using the page load event to trigger the notes field, [here](frontend/s2-notes.js#L186), but this doesn't always work. Is there some other event I should be triggering on?
- A PR to auto-save the notes in some sensible fashion. Things I've tried, but didn't end up using:
  - Save on every keystroke. This feels like too many actions.
  - Save after some amount of time with no changes to the notes (like 100ms). I didn't do this because if you exit the page too quickly after making an edit, the notes won't be auto-saved.

## Storage details

When you click `Save`, your notes are dumped to a `.json` file in the directory given by the `S2_NOTES_DIR` environment variable. The files are named by their *Semantic Scholar ID*, which is a unique `int` associated with each paper. The following fields are recorded in the `json`.

- `author: str`: First paper author, according to Semantic Scholar (S2).
- `doi: (str | null)`: DOI. If available, you can use it to look up the paper at [doi.org](https://www.doi.org/).
- `doi_link: (str | null)`: A DUI URL. If available, it should give a direct link to the paper.
- `notes: str`: Your notes for this paper.
- `paper_id: int`: The S2 paper ID; same as the filename.
- `timestamp: int`: Output of Javascript `Date.now()`. Just gives a timestamp for when you saved this note.
- `title: int`: Paper title.

## Acknowledgments

Thanks to [Jiechen Chen](https://www.linkedin.com/in/jiechen-chen/) for writing the backend!
