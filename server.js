const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Enable CORS for all routes (CORS middleware is configured globally)
// You can restrict it by specifying the allowed origins, methods, and headers.
app.use(cors({
  origin: '*', // Allow all domains (use specific domains if necessary, e.g. ['http://example.com'])
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true, // Allow cookies to be sent with requests (if necessary)
}));

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

// Check MySQL connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + db.threadId);
});

// Allow pre-flight OPTIONS request for CORS
app.options('*', cors());

// Endpoint to handle comment submission
app.post("/submit-comment", (req, res) => {
  const { name, comment } = req.body;

  console.log("Received comment submission:", req.body);

  if (!name || !comment) {
    console.log("Name or comment missing");
    return res.status(400).send("Name and comment are required!");
  }

  // Insert comment into the database
  db.query(
    "INSERT INTO comments (name, comment) VALUES (?, ?)",
    [name, comment],
    (err, result) => {
      if (err) {
        console.error('Error inserting comment into database:', err);
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
      console.error('Error fetching comments from database:', err);
      return res.status(500).send("Failed to fetch comments!");
    }
    console.log("Fetched comments:", rows);
    res.json(rows); // Send comments as JSON
  });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
