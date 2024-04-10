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
    const { Name, Email, Password, ConfirmPassword } = req.body;
    if (!Name || !Email || !Password || !ConfirmPassword) {
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
        const insertUserQuery = 'INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)';
        connection.query(insertUserQuery, [Name, Email, hashedPassword], (insertErr, result) => {
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




// Admin Login
app.post('/Adlogin', (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(400).json({ message: 'Email and password are required', success: false });
  }

  const adminSql = 'SELECT * FROM Admins WHERE Email = ?';

  connection.query(adminSql, [Email], (err, adminsResults) => {
    if (err) {
      console.error('Admin SQL error:', err);
      return res.status(500).json({ message: 'Internal server error', success: false });
    }
    if (adminsResults.length === 0) {
      return res.status(404).json({ message: 'Admin not found', success: false });
    }

    const admin = adminsResults[0];

    if (Password !== admin.Password) {
      return res.status(401).json({ message: 'Invalid password', success: false });
    }

    // Admin login successful
    return res.status(200).json({ message: 'Admin login successful', success: true });
  });
});




  //product listings

  app.post('/products', (req, res) => {
    const { name, description, price, quantityAvailable } = req.body;
    const query = 'INSERT INTO Products (Name, Description, Price, QuantityAvailable) VALUES (?, ?, ?, ?)';
    connection.query(query, [name, description, price, quantityAvailable], (err, result) => {
      if (err) {
        console.error('Error adding product:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Product added successfully', productId: result.insertId });
    });
  });
  app.get('/products', (req, res) => {
    const query = 'SELECT * FROM Products';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
  });

//cart
let cart = [];

// Route to add a product to the cart
app.post('/cart', (req, res) => {
  const { userID, productID, quantity } = req.body;
  
  // Add validation for userID, productID, and quantity
  if (!userID || !productID || !quantity) {
      return res.status(400).json({ error: 'UserID, productID, and quantity are required' });
  }
  
  // Insert the cart item into the database
  const query = 'INSERT INTO Carts (UserID, ProductID, Quantity) VALUES (?, ?, ?)';
  connection.query(query, [userID, productID, quantity], (err, result) => {
      if (err) {
          console.error('Error adding item to cart:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ message: 'Item added to cart successfully' });
  });
});







// Route to get items in the cart for a specific user
app.get('/cart/:userID', async (req, res) => {
  const userID = req.params.userID;
  try {
    // Perform a SQL query to fetch cart items with product details for the specified userID from the Carts and Products tables
    const query = `
      SELECT Carts.*, Products.Name AS ProductName, Products.Description AS ProductDescription, Products.Price AS ProductPrice
      FROM Carts
      INNER JOIN Products ON Carts.ProductID = Products.ProductID
      WHERE Carts.UserID = ?
    `;
    connection.query(query, [userID], (error, results) => {
      if (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({ error: 'Failed to fetch cart. Please try again later.' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart. Please try again later.' });
  }
});

// Route to remove an item from the cart
app.delete('/cart/:userID/:productID', (req, res) => {
  const userID = req.params.userID;
  const productID = req.params.productID;
  
  // Perform SQL delete operation to remove the item from the Carts table
  const deleteQuery = 'DELETE FROM Carts WHERE UserID = ? AND ProductID = ?';
  connection.query(deleteQuery, [userID, productID], (error, result) => {
    if (error) {
      console.error('Error deleting item from cart:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.sendStatus(200); // Send success response
  });
});







  app.put('/products/:productId', (req, res) => {
    const { name, description, price, quantityAvailable } = req.body;
    const productId = req.params.productId;
    const query = 'UPDATE Products SET Name=?, Description=?, Price=?, QuantityAvailable=? WHERE ProductID=?';
    connection.query(query, [name, description, price, quantityAvailable, productId], (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Product updated successfully' });
    });
  });
  router.delete('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const query = 'DELETE FROM Products WHERE ProductID=?';
    connection.query(query, [productId], (err, result) => {
      if (err) {
        console.error('Error deleting product:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Product deleted successfully' });
    });
  });


  //


// Route to create a new delivery
app.post('/deliveries', (req, res) => {
  const { orderID, deliveryDate, deliveryAddress, status } = req.body;
  
  // Check if all required fields are provided
  if (!orderID || !deliveryDate || !deliveryAddress || !status) {
    return res.status(400).json({ message: 'All fields are required for creating a delivery', success: false });
  }
  
  // Prepare SQL query to insert new delivery record into the database
  const insertDeliveryQuery = 'INSERT INTO Deliveries (OrderID, DeliveryDate, DeliveryAddress, Status) VALUES (?, ?, ?, ?)';
  
  // Execute the SQL query with the provided data
  connection.query(insertDeliveryQuery, [orderID, deliveryDate, deliveryAddress, status], (err, result) => {
    if (err) {
      console.error('Error creating delivery:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // If insertion is successful, return a success response with the newly created delivery ID
    res.status(201).json({ message: 'Delivery created successfully', deliveryID: result.insertId });
  });
});
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }); 
