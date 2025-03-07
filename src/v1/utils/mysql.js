const mysql = require('mysql2');  // Use mysql2 package
const config = require('./../../config/config');

// Create a MySQL connection using environment variables
const db = mysql.createConnection({
  host: config.MYSQL_HOST,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DB,
  port: config.MYSQL_PORT
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
