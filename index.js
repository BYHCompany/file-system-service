//Config dotenv for multi env
const NODE_ENV = process.env.NODE_ENV;
require('dotenv').config({ path: `.env.${NODE_ENV}` });

//Imports
const cors = require('cors');
const express = require('express');
const errorMiddleware = require('./src/middlewares/error-middleware');
const router = require('./src/router');
const multer = require('multer');
const upload = multer();
const logger = require('./src/logger');
const authMiddleware = require('./src/middlewares/auth-middleware');
const compression = require('compression');

//Define server port
const PORT = process.env.PORT || 5000;

//Create our app
const app = express();

//Use CORS middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);

//Compress all routes
app.use(compression());

//Accept express to parse JSON
app.use(express.json());

//Allow app to decode url-encoded data
app.use(express.urlencoded({ extended: true }));

//Allow app to decode form-data data
app.use(upload.any());

//Get access to static files
app.use(express.static(`${__dirname}/static`));

//Connect Auth Middleware
app.use(authMiddleware);

//Use app router
app.use('/', router);

//Use Error handler
app.use(errorMiddleware);

app.use((req) => {
  logger.info(
    `${req.statusCode} | ${req.route.path ? req.route.path : ''} | ${req.ip} | ${req.headers.host}`,
  );
});

//Listen port
app.listen(PORT, () => {
  console.log(`Server is listening ${PORT} port in ${NODE_ENV} mode!`);
});

module.exports = { NODE_ENV };
