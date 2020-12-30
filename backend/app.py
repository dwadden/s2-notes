import json
import os

from flask import Flask, request, jsonify

app = Flask(__name__)

NOTES_DIR = 'notes_ex'


@app.route('/GetNotes/<int:paper_id>')
def get_notes(paper_id):
    if not os.path.exists(f'{NOTES_DIR}/{paper_id}.json'):
        return 'File does not exist', 404
 
    with open(f'notes_ex/{paper_id}.json') as f:
        data = json.load(f)
    print(data)
    return json.dumps(data)


@app.route('/SetNotes', methods=['POST'])
def set_notes():
    if not request.json:
        return 'No data passed in', 400
    elif not 'paper_id' in request.json:
        return 'Missing paper_id field', 400
    elif not 'title' in request.json:
        return 'Missing title field', 400

    paper_id = request.json['paper_id']
    file_json = {
        'title': request.json['title'],
        'notes': request.json.get('notes', ""),
    }

    with open(f'{NOTES_DIR}/{paper_id}.json', 'w') as f:
        json.dump(file_json, f)

    return jsonify({
        'data saved to ' + str(paper_id) + '.json': file_json
        }), 201

