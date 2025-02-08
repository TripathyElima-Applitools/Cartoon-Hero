// server.js


const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

// If you want to allow specific origins
// app.use(cors({ origin: 'http://your-frontend-domain.com' }));

app.get('/comments', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Set up MySQL connection
const db = mysql.createConnection({
  host: "localhost",       // Replace with your MySQL host
  user: "root",            // Replace with your MySQL user
  password: "",            // Replace with your MySQL password
  database: "tom_and_jerry"
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files like your HTML, CSS, and JS

// Endpoint to handle comment submission
app.post("/submit-comment", (req, res) => {
  const { name, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).send("Name and comment are required!");
  }

  // Insert comment into the database
  db.query(
    "INSERT INTO comments (name, comment) VALUES (?, ?)",
    [name, comment],
    (err, result) => {
      if (err) {
        return res.status(500).send("Failed to save the comment!");
      }
      res.status(200).send("Comment saved successfully!");
    }
  );
});

// Endpoint to fetch all comments
app.get("/comments", (req, res) => {
  db.query("SELECT * FROM comments ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).send("Failed to fetch comments!");
    }
    res.json(rows); // Send comments as JSON
  });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
