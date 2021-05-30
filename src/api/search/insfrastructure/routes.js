const express = require('express');

const GETSearchProducts = require('./GETSearchProduct.route');

const router = express.Router();

router[GETSearchProducts.method.toLocaleLowerCase()](
  GETSearchProducts.route,
  GETSearchProducts.action
);

module.exports = router;
