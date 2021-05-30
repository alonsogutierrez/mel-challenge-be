const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const searchRouter = require('./api/search/insfrastructure/routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(searchRouter);

module.exports = app;
