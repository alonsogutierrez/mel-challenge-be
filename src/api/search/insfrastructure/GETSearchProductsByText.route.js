const HTTPCodes = require('http-status-codes');

const ProductUseCases = require('../use-cases/search');

const logger = console;

const action = async (req, res) => {
  try {
    const { q } = req.query;
    logger.info('Begin to search products: ', q);
    const productsResponse = await ProductUseCases.getProductsByText(q);
    res.status(HTTPCodes.OK).send(productsResponse);
  } catch (err) {
    res.status(HTTPCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search products: ${err.message}`
    });
  }
};

const route = '/api/items';
const method = 'GET';

module.exports = {
  method,
  route,
  action
};
