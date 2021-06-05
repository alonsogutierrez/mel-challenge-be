const express = require('express');
const middlewares = require('./middlewares');

const GETSearchProductsByText = require('./GETSearchProductsByText.route');
const GETSearchProductById = require('./GETSearchProductById.route');
const router = express.Router();

router[GETSearchProductsByText.method.toLocaleLowerCase()](
  GETSearchProductsByText.route,
  middlewares.isValidRequest,
  GETSearchProductsByText.action
);

router[GETSearchProductById.method.toLocaleLowerCase()](
  GETSearchProductById.route,
  middlewares.isValidRequest,
  GETSearchProductById.action
);

module.exports = router;
