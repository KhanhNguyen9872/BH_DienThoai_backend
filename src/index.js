require('events').EventEmitter.defaultMaxListeners = 50;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./utils/mysql'); // Import the MySQL connection
const { verifyToken } = require('./utils/authenticate');
const telebot = require('./utils/telebot');
const app = express();
const port = process.env.EXPRESS_PORT || 5000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // extended: true allows parsing of complex objects
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

const products = require('./router/products');
const accounts = require('./router/accounts');
const users = require('./router/users');
const address = require('./router/address');
const carts = require('./router/carts');
const vouchers = require('./router/vouchers');
const orders = require('./router/orders');
const chatbot = require('./router/chatbot');
const img = require('./router/img');

// Example route
app.use('/products', products);
app.use('/accounts', accounts);
app.use('/user', verifyToken, users);
app.use('/address', verifyToken, address);
app.use('/carts', verifyToken, carts);
app.use('/vouchers', verifyToken, vouchers);
app.use('/orders', verifyToken, orders);
app.use('/chatbot', verifyToken, async (req, res, next) => {
  try {
    // Query the database to check the value of CHATBOT_ENABLE using promise-based syntax
    const [rows] = await db.promise().query("SELECT value FROM settings WHERE `key` = 'CHATBOT_ENABLE'");

    if (rows.length > 0 && rows[0].value == '0') {
      // If the value is '1', proceed to the next middleware or chatbot logic
      return res.status(403).json({ message: 'Access denied. Chatbot is disabled.' });
    } else if (rows.length > 0) {
      // If the value is '0', deny access
      return next();
    } else {
      return res.status(403).json({ message: 'Access denied. Chatbot is not configured.' });
    }
  } catch (err) {
    console.error('Error checking chatbot settings:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}, chatbot);
app.use('/img', img);

app.get('/status', async (req, res) => {
  try {
    // Query the database for both the "MAINTENANCE" and "CHATBOT_ENABLE" keys
    const [maintenanceRows] = await db.promise().query('SELECT value FROM settings WHERE `key` = "MAINTENANCE"');
    const [chatbotRows] = await db.promise().query('SELECT value FROM settings WHERE `key` = "CHATBOT_ENABLE"');

    // Check if the keys exist and return the appropriate status
    const maintenanceStatus = maintenanceRows[0]?.value == '0' ? 'ALIVE' : 'MAINTENANCE';
    const chatbotEnabled = chatbotRows[0]?.value;

    // Return the status and the chatbot flag
    res.json({
      status: maintenanceStatus,
      chatbot: chatbotEnabled
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'ERROR' });
  }
});

// Default 404 handler
app.use((req, res, next) => {
  res.status(404).json({
      error: 'NOT FOUND',
  });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
      error: 'Internal server error',
      message: err.message,
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
