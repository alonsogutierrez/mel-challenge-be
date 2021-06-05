const HTTPCodes = require('http-status-codes');

const ProductUseCases = require('../use-cases/search');

const logger = console;

const action = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Begin to search product by id: ', id);
    const productResponse = await ProductUseCases.getProductById(id);
    if (productResponse.message === 'Product not found') {
      res.status(HTTPCodes.NOT_FOUND).send({
        error: 'Product not found'
      });
    }
    res.status(HTTPCodes.OK).send(productResponse);
  } catch (err) {
    res.status(HTTPCodes.INTERNAL_SERVER_ERROR).send({
      error: `Can't search product by id: ${err.message}`
    });
  }
};

const route = '/api/items/:id';
const method = 'GET';

module.exports = {
  method,
  route,
  action
};
