const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');

// Initialize dotenv to load environment variables
app.use(express.json()); // Middleware to parse JSON requests
dotenv.config();

// Middleware
app.use(cors()); // Enable CORS for all routes
const port = 4000

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


  

// Connect to the database
db.connect((err) => {
   if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.get('/', (req, res) => {
res.send('Welcome to JusticeNow API');
});

// Login route
app.post('/login', (req, res) => {
const { email, password } = req.body;
const query = "SELECT * FROM users WHERE email = ?";

db.query(query, [email], (err, result) => {
     if (err) throw err;

    if (result.length > 0) {
       const user = result[0];
       // Compare the hashed password
       bcrypt.compare(password, user.password, (err, isMatch) => {
         if (err) throw err;
         if (isMatch) {
           res.send('Login successful');
         } else {
           res.status(401).send('Invalid password');
         }
       });
     } else {
       res.status(404).send('User not found');
     }
   });
});



 // Report an incident route
 app.post('/report', (req, res) => {
     const { name, incident, location } = req.body;
     const query = "INSERT INTO reports (name, incident, location) VALUES (?, ?, ?)";
    
     db.query(query, [name, incident, location], (err, result) => {
       if (err) {
         console.error('Error inserting report:', err.message);
         return res.status(500).send('Internal Server Error');
       }
       res.send('Report submitted successfully!');
     });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
