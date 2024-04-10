const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecom"
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Register a new user
app.post('/register', (req, res) => {
    const { Name, Email, Password, Address, PhoneNumber } = req.body;
    if (!Name || !Email || !Password || !Address || !PhoneNumber) {
      return res.status(400).json({ message: 'All fields are required', success: false });
    }
  
    // Check if the email already exists
    const checkEmailQuery = 'SELECT * FROM Users WHERE Email = ?';
    connection.query(checkEmailQuery, [Email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error', success: false });
      }
  
      if (results.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists', success: false });
      }
  
      // Hash the password
      bcrypt.hash(Password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error(hashErr);
          return res.status(500).json({ message: 'Internal server error', success: false });
        }
  
        // If email doesn't exist and password is hashed, proceed with registration
        const insertUserQuery = 'INSERT INTO Users (Name, Email, Password, Address, PhoneNumber) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertUserQuery, [Name, Email, hashedPassword, Address, PhoneNumber], (insertErr, result) => {
          if (insertErr) {
            console.error(insertErr);
            return res.status(500).json({ message: 'Registration failed', success: false });
          }
          console.log(result);
          res.status(201).json({ message: 'Registration successful', success: true });
        });
      });
    });
  });


// Login an existing user
app.post('/login', (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(400).json({ message: 'Email and password are required', success: false });
  }

  const userSql = 'SELECT * FROM Users WHERE Email = ?';

  connection.query(userSql, [Email], (err, usersResults) => {
    if (err) {
      console.error('User SQL error:', err);
      return res.status(500).json({ message: 'Internal server error', success: false });
    }
    if (usersResults.length === 0) {
        return res.status(404).json({ message: 'User not found', success: false });
      }
  
      const user = usersResults[0];
      bcrypt.compare(Password, user.Password, (bcryptErr, isMatch) => {
        if (bcryptErr) {
          console.error(bcryptErr);
          return res.status(500).json({ message: 'Internal server error', success: false });
        }
  
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid password', success: false });
        }
  
        // Password is correct, return user data
        res.status(200).json({ user, success: true });
      });
    });
  });
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }); 