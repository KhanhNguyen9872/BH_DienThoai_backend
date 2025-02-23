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

// Example route
app.use('/products', products);
app.use('/accounts', accounts);
app.use('/user', verifyToken, users);
app.use('/address', verifyToken, address);
app.use('/carts', verifyToken, carts);
app.use('/vouchers', verifyToken, vouchers);
app.use('/orders', verifyToken, orders);

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
