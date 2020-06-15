// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var db = require("./db/db.json");
var fs = require("fs");



// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//serve static contenct for the app from the public directory in the application directory
app.use(express.static("public"));

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  return res.json(db);
});

//  * POST `/api/notes`
// Should receive a new note to save on the request body,
// add it to the `db.json` file, and 
//then return the new note to the client.

app.post("/api/notes", function(req, res) {
  req.body.id=db.length;
  db.push(req.body)

  fs.writeFile("./db/db.json", JSON.stringify(db), function(err) {

    if (err) {
      return console.log(err);
    }
  
    console.log("Success!");
  
  });
  return res.json(req.body);

});



//* DELETE `/api/notes/:id` -
// Should receive a query parameter containing the id of a note
// to delete. This means you'll need to find a way to give each
// note a unique `id` when it's saved. In order to delete a note,
// you'll need to read all notes from the `db.json` file, 
//remove the note with the given `id` property, and
// then rewrite the notes to the `db.json` file.


app.delete("/api/notes/:id", function(req, res) {
  //verify the updatedata
 

 //console.log(db.splice(req.params.id, 1));
 //update data

 fs.writeFile("./db/db.json", JSON.stringify(db.splice(req.params.id, 1)), function(err) {

  if (err) {
    return console.log(err);
  }

  console.log("Success!");
  return res.send("This was deleted");

});


 
});

// Displays all notes
app.get("/api/public", function(req, res) {
  return res.json(notes);
});

// Displays a single note, or returns false
app.get("/api/public/:note", function(req, res) {
  var chosen = req.params.note;

  console.log(chosen);

  for (var i = 0; i < notes.length; i++) {
    if (chosen === notes[i].routeName) {
      return res.json(notes[i]);
    }
  }

  return res.json(false);
});

// Create New Notes - takes in JSON input
app.post("/api/notes", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var newNote = req.body;

  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  newNote.routeName = newNote.name.replace(/\s+/g, "").toLowerCase();

  console.log(newNote);

  notes.push(newNote);

  res.json(newNote);
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
