const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3333;

app.use(cors());

let db = new sqlite3.Database('../data/profiledata.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the profiledata database.');
    });

app.get('/data', (req, res) => {
    const sql = 'SELECT * FROM profiles';
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
});

app.get('/data/:username', (req, res) => {
    const sql = 'SELECT * FROM profiles WHERE username = ?';
    db.all(sql, [req.params.username], (err, row) => {
        if (err) {
            throw err;
        }
        res.send(row);
    });
});

app.get('/data/:username/followers', (req, res) => {
    const sql = 'SELECT followers_count, timestamp FROM profiles WHERE username = ? ORDER BY timestamp ASC';
    db.all(sql, [req.params.username], (err, row) => {
        if (err) {
            throw err;
        }
        res.send(row);
    });
});

app.get('/data/:username/following', (req, res) => {
    const sql = 'SELECT following_count, timestamp FROM profiles WHERE username = ? ORDER BY timestamp ASC';
    db.all(sql, [req.params.username], (err, row) => {
        if (err) {
            throw err;
        }
        res.send(row);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


