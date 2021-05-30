const HTTPCodes = require('http-status-codes');

const logger = console;

const action = (req, res) => {
  try {
    const { query } = req.query;
    logger.info('Begin to search products: ', query);
    //  TODO: Call mel BFF endpoint to get all products
    res.status(HTTPCodes.OK).send({
      response: {
        products: [
          {
            id: 1,
            name: 'Test product'
          }
        ]
      }
    });
  } catch (err) {
    res.status(HTTPCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search products: ${err.message}`
    });
  }
};

const route = '/search';
const method = 'GET';

module.exports = {
  method,
  route,
  action
};
