const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/db.sqlite");

// Add New Book
router.post("/add", (req, res) => {
  const { title, author, genre, publication_date, isbn } = req.body;
  const query = `INSERT INTO Inventory (title, author, genre, publication_date, isbn) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [title, author, genre, publication_date, isbn], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error adding book");
    }
    res.redirect("/");
  });
});

// Filter Books
router.get("/filter", (req, res) => {
  const { title, author, genre, publication_date } = req.query;
  let query = "SELECT * FROM Inventory WHERE 1=1";
  const params = [];

  if (title) {
    query += " AND title LIKE ?";
    params.push(`%${title}%`);
  }
  if (author) {
    query += " AND author LIKE ?";
    params.push(`%${author}%`);
  }
  if (genre) {
    query += " AND genre LIKE ?";
    params.push(`%${genre}%`);
  }
  if (publication_date) {
    query += " AND publication_date = ?";
    params.push(publication_date);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error filtering books");
    }
    res.json(rows);
  });
});

// Fetch All Books Route
router.get("/all", (req, res) => {
  db.all("SELECT * FROM Inventory", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Export Data (CSV)
router.get("/export", (req, res) => {
  const format = req.query.format || "json";
  db.all("SELECT * FROM Inventory", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error exporting books");
    }

    if (format === "csv") {
      let csv = "Entry ID,Title,Author,Genre,Publication Date,ISBN\n";
      rows.forEach((row) => {
        csv += `${row.entry_id},${row.title},${row.author},${row.genre},${row.publication_date},${row.isbn}\n`;
      });
      res.header("Content-Type", "text/csv");
      res.attachment("books.csv");
      return res.send(csv);
    }

    res.json(rows);
  });
});

module.exports = router;
