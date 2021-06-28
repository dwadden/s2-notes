# Semantic Scholar notes

Do you use Semantic Scholar? Do you take notes when you read papers? The goal of this repo is to let you record and view your paper notes in Semantic Scholar itself, like so:

<img src="img/example.png" alt="example" width="600"/>

Semantic Scholar is an amazing academic search engine and also has functionality to organize a library of papers, similar to software like [Mendeley](https://www.mendeley.com/) or [Papers](https://www.papersapp.com/). But it doesn't offer a convenient way to take personalized notes and display them together with other information on the paper you're reading. This repo attempts (hackily) to add this feature.

It adds a notes section below the main information section on each paper. It supports Markdown as well as Mathjax. The notes are stored locally on your machine as `.json` files, in a directory of your choosing.

## Setup

I've only tried this with Google Chrome, running on a Macbook.

Follow these steps:

- Clone the repo.
- Set the environment variable `S2_NOTES_DIR`. It's probably easiest to put this in a startup file like your `.bash_profile` or `.bashrc`. Create a directory at this location. Your notes will go here
- Install [Tampermonkey](https://www.tampermonkey.net) for Chrome.
- Create a new blank Tampermonkey script. Copy the contents of `frontend/s2-notes.js` into the script, and save the script.
  - See the Tampermonkey docs for information on how to create and activate a script.
- In a terminal window, navigate to the `backend` subdirectory and enter `bash run.sh`. The server should start.

## Usage

Once you've got the Tampermonkey script installed and the backend server running, you should see a notes window like the one in the image above every time you open a new article page on Semantic Scholar. Two caveats:

- When you navigate to a new paper, you may need to refresh the page in order for the notes section to show up. I'll try to fix this, or I'd welcome a PR to do it!
- Make sure to *save your notes*, they will not save automatically. PR's welcome.

## Storage details

When you click `Save`, your notes are dumped to a `.json` file in the directory given by the `S2_NOTES_DIR` environment variable. The files are named by their *Semantic Scholar ID*, which is a unique `int` associated with each paper. The following fields are recorded in the `json`.

- `paper_id`: Semantic Scholar (S2) ID, same as the file name.
- `title`: Paper title, according to S2.
- `author`: First author for the paper, according to S2.
- `notes`: Your notes, as plaintext.
