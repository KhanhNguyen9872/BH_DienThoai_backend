require('events').EventEmitter.defaultMaxListeners = 50;
const API_VERSION = "v1";

const express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  path = require('path'),
  config = require('./config/config'),
  { verifyToken } = require(`./${API_VERSION}/utils/auth`);

const app = express();
const port = config.EXPRESS_PORT || 5000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

const routes = [
  { path: 'products', route: require(`./${API_VERSION}/routers/productRoute`) },
  { path: 'accounts', route: require(`./${API_VERSION}/routers/accountRoute`) },
  { path: 'user', route: require(`./${API_VERSION}/routers/userRoute`), middleware: [verifyToken] },
  { path: 'address', route: require(`./${API_VERSION}/routers/addressRoute`), middleware: [verifyToken] },
  { path: 'carts', route: require(`./${API_VERSION}/routers/cartRoute`), middleware: [verifyToken] },
  { path: 'vouchers', route: require(`./${API_VERSION}/routers/voucherRoute`), middleware: [verifyToken] },
  { path: 'orders', route: require(`./${API_VERSION}/routers/orderRoute`), middleware: [verifyToken] },
  {
    path: 'chatbot',
    route: require(`./${API_VERSION}/routers/chatbotRoute`),
    middleware: [verifyToken, require(`./${API_VERSION}/utils/aichatbot`).checkChatbotEnable]
  },
  { path: 'img', route: require(`./${API_VERSION}/routers/imgRoute`) },
  { path: 'status', route: require(`./${API_VERSION}/routers/statusRoute`) }
];

routes.forEach(r => {
  const middlewares = r.middleware || [];
  app.use(`/api/${API_VERSION}/${r.path}`, ...middlewares, r.route);
});

app.use((req, res) => res.status(404).json({ error: 'NOT FOUND' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
