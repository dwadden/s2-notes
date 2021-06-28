import json
import os

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Get the notes directory and confirm that it exists and is a directory
NOTES_DIR = os.getenv("S2_NOTES_DIR")

if NOTES_DIR is None:
    raise EnvironmentError("S2_NOTES_DIR not found as environment variable.")

if not os.path.isdir(NOTES_DIR):
    raise EnvironmentError("No directory found for S2_NOTES_DIR.")


@app.route("/GetNotes/<int:paper_id>")
def get_notes(paper_id):
    "Get notes from file, or return empty string if not present."
    if not os.path.exists(f"{NOTES_DIR}/{paper_id}.json"):
        # If notes don't exist for this paper, just return an empty string.
        data = {"notes": ""}
    else:
        # Otherwise load the data and get the notes.
        with open(f"{NOTES_DIR}/{paper_id}.json") as f:
            data = json.load(f)

    return jsonify(data)


@app.route("/SetNotes", methods=["POST"])
def set_notes():
    if not request.json:
        return "No data passed in", 400
    elif "paper_id" not in request.json:
        return "Missing paper_id field", 400
    elif "title" not in request.json:
        return "Missing title field", 400

    paper_id = request.json["paper_id"]
    file_json = {
        "paper_id": paper_id,
        "doi": request.json["doi"],
        "doi_link": request.json["doi_link"],
        "title": request.json["title"],
        "author": request.json["author"],
        "timestamp": request.json["timestamp"],
        "notes": request.json.get("notes", "")
    }

    with open(f"{NOTES_DIR}/{paper_id}.json", "w") as f:
        json.dump(file_json, f, sort_keys=4, indent=True)

    return jsonify({
        "data saved to " + str(paper_id) + ".json": file_json
        }), 201
