const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Serves files like Home.html from the 'projekt' folder
app.use(express.static(path.join(__dirname, 'projekt')));

// ✅ MySQL DB connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected!');
});

// ✅ Registration route
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    const checkSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkSql, [email], (err, result) => {
        if (err) return res.status(500).send('Server error');
        if (result.length > 0) {
            return res.status(400).send('User already exists');
        } else {
            const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
            db.query(insertSql, [email, password], (err, result) => {
                if (err) return res.status(500).send('Server error');
                return res.status(200).send('User registered successfully');
            });
        }
    });
});

// ✅ Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).send('Server error');
        if (result.length > 0) {
        
            res.status(200).send({ success: true, redirect: 'Home.html' });
        } else {
            res.status(401).send({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
