const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; 
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const MYSQL_DB = process.env.MYSQL_DB;
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_PORT = process.env.MYSQL_PORT;
const EXPRESS_PORT = process.env.EXPRESS_PORT;

module.exports = { JWT_SECRET_KEY, JWT_EXPIRATION, MYSQL_DB, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USER, MYSQL_PORT, EXPRESS_PORT };