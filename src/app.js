const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const httpStatus = require('http-status');
const routes = require('./routes/v1');

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());

// v1 api routes
app.use('/api/v1', routes);

module.exports = app;