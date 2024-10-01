const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// Database setup
const db = new sqlite3.Database(
  path.join(__dirname, "database", "db.sqlite"),
  (err) => {
    if (err) {
      console.error("Error opening database: " + err.message);
    } else {
      console.log("Connected to SQLite database");

      // Create the Inventory table if it doesn't exist
      db.serialize(() => {
        db.run(
          `
        CREATE TABLE IF NOT EXISTS Inventory (
          entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          genre TEXT,
          publication_date TEXT,
          isbn TEXT UNIQUE NOT NULL
        );
      `,
          (err) => {
            if (err) {
              console.error("Error creating Inventory table: " + err.message);
            } else {
              console.log("Inventory table created or already exists.");
            }
          }
        );
      });
    }
  }
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Routes
const booksRoutes = require("./routes/books");
app.use("/books", booksRoutes);

// Home Route
app.get("/", (req, res) => {
  res.render("layout");
});

// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
