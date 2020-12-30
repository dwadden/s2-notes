import json
import os

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


NOTES_DIR = "/Users/dwadden/Google-Drive/uw/research/paper-notes"


@app.route("/GetNotes/<int:paper_id>")
def get_notes(paper_id):
    if not os.path.exists(f"{NOTES_DIR}/{paper_id}.json"):
        # If notes don't exist for this paper, just return an empty string.
        data = {"paper_id": None,
                "title": None,
                "notes": ""}
    else:
        # Otherwise load the data.
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
        "title": request.json["title"],
        "notes": request.json.get("notes", "")
    }

    with open(f"{NOTES_DIR}/{paper_id}.json", "w") as f:
        json.dump(file_json, f)

    return jsonify({
        "data saved to " + str(paper_id) + ".json": file_json
        }), 201
