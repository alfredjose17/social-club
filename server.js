const express = require('express');
const mysql = require('mysql');
const app = express();

// Middleware to parse incoming request bodies
app.use(express.json());

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Humber5!',
    database: 'social_club'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// GET - Retrieve all books
app.get('/books', (req, res) => {
    connection.query('SELECT * FROM Book', (err, results) => {
        if (err) {
            console.error('Error retrieving books:', err);
            res.status(500).json({ error: 'Error retrieving books' });
            return;
        }
        res.json(results);
    });
});

// POST - Add a new book
app.post('/books', (req, res) => {
    const newBook = req.body;
    const sql = 'INSERT INTO Book (title, description) VALUES (?, ?)';
    connection.query(sql, [newBook.title, newBook.description], (err, result) => {
        if (err) {
            console.error('Error adding book:', err);
            res.status(500).json({ error: 'Error adding book' });
            return;
        }
        res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
    });
});

// PUT - Update a book by ID
app.put('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const updatedBook = req.body;
    const sql = 'UPDATE Book SET title = ?, description = ? WHERE id = ?';
    connection.query(sql, [updatedBook.title, updatedBook.description, bookId], (err) => {
        if (err) {
            console.error('Error updating book:', err);
            res.status(500).json({ error: 'Error updating book' });
            return;
        }
        res.json({ message: `Book with ID ${bookId} updated successfully` });
    });
});

// DELETE - Delete a book by ID
app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const sql = 'DELETE FROM Book WHERE id = ?';
    connection.query(sql, bookId, (err) => {
        if (err) {
            console.error('Error deleting book:', err);
            res.status(500).json({ error: 'Error deleting book' });
            return;
        }
        res.json({ message: `Book with ID ${bookId} deleted successfully` });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
