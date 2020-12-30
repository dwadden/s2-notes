# Starting the Server

In this directory, type:
 
export FLASK_APP=app.py

flask run

# Endpoints

To hit the GET endpoint with a paper_id of 25, load the following in browser:

http://127.0.0.1:5000/GetNotes/25


To hit the POST endpoint with paper_id of 21, paste the following into terminal: 

curl -i -H "Content-Type: application/json" -X POST -d '{"paper_id":21, "title":"paper title here", "notes":"la la la"}' http://127.0.0.1:5000/SetNotes


# Notes

To modify where the notes are stored, change the 'NOTES_DIR' variable in app.py.
