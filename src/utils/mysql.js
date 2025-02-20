const mysql = require('mysql2');  // Use mysql2 package

// Create a MySQL connection using environment variables
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'khanhnguyen',
  database: 'phone_shop',
  port: '3306'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Successfully connected to MySQL');
});

// Export the database connection for use in other files
module.exports = db;
