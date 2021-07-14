//Config dotenv for multi env
const NODE_ENV = process.env.NODE_ENV;
require('dotenv').config({ path: `.env.${NODE_ENV}` });

//Imports
const cors = require('cors');
const express = require('express');

//Define server port
const PORT = process.env.PORT || 5000;

//Create our app
const app = express();

//Use CORS middleware
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is listening ${PORT} port in ${NODE_ENV} mode!`);
});
