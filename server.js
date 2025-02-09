// Importing necessary modules
const express = require("express"); // Express framework to create the server and handle requests
const mysql = require("mysql2"); // MySQL client to interact with MySQL database
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing (CORS)

// Create an Express application
const app = express();

// Enable CORS for all routes (CORS middleware is configured globally)
// This allows your server to accept requests from any domain. You can restrict it by specifying
// specific domains, HTTP methods, or headers.
app.use(cors({
    origin: '*', // Allow all domains. You can replace '*' with specific domains like ['http://example.com']
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow cookies to be sent with requests (if necessary)
}));

// Set up MySQL connection
const db = mysql.createConnection({
    host: "localhost", // MySQL host (localhost or IP address)
    user: "root", // MySQL username
    password: "", // MySQL password (leave empty if there is no password)
    database: "tom_and_jerry" // The name of your MySQL database
});

// Middleware to parse URL-encoded bodies (from forms) and JSON bodies
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Serve static files from the "public" directory (like HTML, CSS, JS files)
app.use(express.static("public"));

// Check MySQL connection to ensure the server is connected to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.stack); // Log the error if the connection fails
        return;
    }
    console.log('Connected to MySQL database as id ' + db.threadId); // Log successful connection to the database
});

// Handle pre-flight OPTIONS request for CORS
app.options('*', cors()); // Respond to OPTIONS requests to handle CORS preflight requests

// Endpoint to handle comment submission (POST request)
app.post("/submit-comment", (req, res) => {
    const {
        name,
        comment
    } = req.body; // Extract name and comment from the request body

    console.log("Received comment submission:", req.body); // Log the received comment submission

    // Validate that both name and comment are provided
    if (!name || !comment) {
        console.log("Name or comment missing"); // Log an error if name or comment is missing
        return res.status(400).send("Name and comment are required!"); // Send a 400 error if data is missing
    }

    // Insert the new comment into the "comments" table in the MySQL database
    db.query(
        "INSERT INTO comments (name, comment) VALUES (?, ?)", // SQL query to insert the comment
        [name, comment], // Values to be inserted (name and comment)
        (err, result) => {
            if (err) {
                console.error('Error inserting comment into database:', err); // Log error if insertion fails
                return res.status(500).send("Failed to save the comment!"); // Send a 500 error if insertion fails
            }
            res.status(200).send("Comment saved successfully!"); // Send success response if insertion succeeds
        }
    );
});

// Endpoint to fetch all comments (GET request)
app.get("/comments", (req, res) => {
    // Fetch all comments from the "comments" table, ordered by creation time in descending order
    db.query("SELECT * FROM comments ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            console.error('Error fetching comments from database:', err); // Log error if fetching comments fails
            return res.status(500).send("Failed to fetch comments!"); // Send a 500 error if fetching fails
        }
        console.log("Fetched comments:", rows); // Log the fetched comments
        res.json(rows); // Send the comments as a JSON response
    });
});

// Start the Express server
const port = 3000; // Port number where the server will listen
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // Log that the server is running
});