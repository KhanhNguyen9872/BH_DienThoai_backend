require('events').EventEmitter.defaultMaxListeners = 50;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./v1/utils/mysql'); // Import the MySQL connection
const { verifyToken } = require('./v1/utils/authenticate');
const app = express();
const port = process.env.EXPRESS_PORT || 5000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // extended: true allows parsing of complex objects
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

const API_VERSION = "v1";

const products = require(`./${API_VERSION}/routers/productRoute`);
const accounts = require(`./${API_VERSION}/routers/accountRoute`);
const users = require(`./${API_VERSION}/routers/userRoute`);
const address = require(`./${API_VERSION}/routers/addressRoute`);
const carts = require(`./${API_VERSION}/routers/cartRoute`);
const vouchers = require(`./${API_VERSION}/routers/voucherRoute`);
const orders = require(`./${API_VERSION}/routers/orderRoute`);
const chatbot = require(`./${API_VERSION}/routers/chatbotRoute`);
const img = require(`./${API_VERSION}/routers/imgRoute`);
const status = require(`./${API_VERSION}/routers/statusRoute`)
const { checkChatbotEnable } = require(`./${API_VERSION}/utils/aichatbot`);

app.use(`/api/${API_VERSION}/products`, products);
app.use(`/api/${API_VERSION}/accounts`, accounts);
app.use(`/api/${API_VERSION}/user`, verifyToken, users);
app.use(`/api/${API_VERSION}/address`, verifyToken, address);
app.use(`/api/${API_VERSION}/carts`, verifyToken, carts);
app.use(`/api/${API_VERSION}/vouchers`, verifyToken, vouchers);
app.use(`/api/${API_VERSION}/orders`, verifyToken, orders);
app.use(`/api/${API_VERSION}/chatbot`, verifyToken, checkChatbotEnable, chatbot);
app.use(`/api/${API_VERSION}/img`, img);
app.use(`/api/${API_VERSION}/status`, status);

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
